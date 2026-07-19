// Node test env (vitest + happy-dom) needs the legacy pdf.js entry (the
// browser build assumes a real DOM canvas/worker environment) — same
// constraint documented in segments.test.ts / rules.test.ts / tables.test.ts /
// blocks.test.ts, all of which load fixtures through this exact entry point
// for getTextContent()/getOperatorList() (never render()). Using the same
// entry point here — not just in tests — keeps the code path this module
// runs under test identical to the one it runs in production; there is no
// second "real" import to silently drift out of sync with what's tested.
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PageViewport } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

import { toSegments, type Segment } from "./segments";
import { orderSegments } from "./reading-order";
import { extractRules } from "./rules";
import { detectRuledTable, detectBorderlessTable, type DetectedTable } from "./tables";
import { classify, type DocBlock } from "./blocks";

// Re-exported so callers (Task 10's PDF -> Word tool, tests) import every
// public layout-engine type from this single module rather than reaching
// into individual pipeline stages.
export type { Segment } from "./segments";
export type { DocBlock } from "./blocks";
export type { DetectedTable } from "./tables";

export interface ExtractResult {
  blocks: DocBlock[];
  pageCount: number;
  /** 0-based indices of pages with no (or negligible) recovered text — image-only, handled by OCR (Task 9), not here. */
  scannedPages: number[];
}

/**
 * A page whose total segment area is under this fraction of the page area is
 * treated as image-only (scanned). Measured floor per the Task 6 brief: real
 * digital-native pages carry far more than this even when sparse (a single
 * title page still clears it), while a genuinely scanned page contributes
 * zero recovered text and lands at exactly 0.
 */
const SCANNED_AREA_RATIO = 0.005;

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function segmentArea(s: Segment): number {
  const w = Number.isFinite(s.w) ? Math.max(s.w, 0) : 0;
  const h = Number.isFinite(s.h) ? Math.max(s.h, 0) : 0;
  return w * h;
}

/**
 * Is this page's recovered text negligible relative to the page area? Covers
 * both the "zero text items at all" case (image-only PDF, no text layer) and
 * the "a stray watermark/pageno text layer over a scanned image" case (some
 * segments, but nowhere near enough to be real body content).
 */
function isScannedPage(segments: Segment[], pageBox: Box): boolean {
  if (segments.length === 0) return true;
  const pageArea = (pageBox.x1 - pageBox.x0) * (pageBox.y1 - pageBox.y0);
  if (!(pageArea > 0)) return true;
  const totalArea = segments.reduce((sum, s) => sum + segmentArea(s), 0);
  return totalArea / pageArea < SCANNED_AREA_RATIO;
}

/**
 * The ONLY call site for `detectBorderlessTable` in this module.
 *
 * Constraint (measured, not stylistic — see tables.ts's contract comment on
 * `detectBorderlessTable`): fed a page-wide, flat segment list, two-column
 * prose reads as a fully-aligned grid and false-positives as a table. Making
 * this the sole entry point — mapping over already-ordered reading-order
 * regions, one call per region — makes that misuse structurally
 * unrepresentable from this file: there is no other path to
 * `detectBorderlessTable` here to accidentally hand it a flat page-wide list.
 */
function detectBorderlessTablesPerRegion(regions: Segment[][]): DetectedTable[] {
  const out: DetectedTable[] = [];
  for (const region of regions) {
    const table = detectBorderlessTable(region);
    if (table) out.push(table);
  }
  return out;
}

/**
 * Drop any table whose segments overlap (by identity) a table already kept,
 * so the same cell text is never consumed twice. `tables` must be ordered
 * strongest-signal-first (ruled before borderless): a ruled table's grid
 * comes from actually-drawn borders, a strictly stronger signal than
 * borderless alignment, so on overlap the ruled table wins and the weaker
 * borderless "detection" of the same cells is dropped.
 *
 * In the normal path this is a no-op — the caller already filters ruled-table
 * segments out of each region before running borderless detection on it (see
 * `extractDocument`), so candidates should never actually overlap. This is a
 * second, independent guard: a ruled table that only partially claims its
 * grid (e.g. a stray cell whose centroid missed every band) would otherwise
 * let borderless detection rediscover the leftover fragment as its own
 * "table", duplicating that text into two blocks.
 */
function dedupeTables(tables: DetectedTable[]): DetectedTable[] {
  const kept: DetectedTable[] = [];
  const consumed = new Set<Segment>();
  for (const table of tables) {
    if (table.segments.some((s) => consumed.has(s))) continue;
    kept.push(table);
    for (const s of table.segments) consumed.add(s);
  }
  return kept;
}

/**
 * Extract a semantic document model (headings/paragraphs/lists/tables) from a
 * PDF by pure geometry, page by page.
 *
 * Per page: recover text segments; if the page is image-only (negligible
 * text area — see `isScannedPage`), record it in `scannedPages` and skip
 * layout entirely (Task 9's OCR path handles those pages, not this one).
 * Otherwise recover reading-order regions and ruling lines, detect ruled
 * tables page-wide (the grid comes from actual drawn borders, so there is no
 * page-wide false-positive risk the way there is for borderless detection),
 * detect borderless tables per region with the ruled table's segments
 * filtered out first (see `detectBorderlessTablesPerRegion`), dedupe any
 * residual overlap, then classify the region/table structure into blocks.
 */
export async function extractDocument(
  data: Uint8Array,
  opts?: { onProgress?: (p: number) => void },
): Promise<ExtractResult> {
  // pdf.js DETACHES the buffer it is handed (the underlying ArrayBuffer is
  // transferred to the worker/decoder). Copying here is non-negotiable: this
  // exact bug — passing the caller's array directly — broke every PDF tool in
  // a previous wave (PR #46). `new Uint8Array(data)` copies the bytes into a
  // fresh, independent buffer; `data` itself is never touched.
  const doc = await getDocument({ data: new Uint8Array(data) }).promise;
  const pageCount: number = doc.numPages;
  const scannedPages: number[] = [];
  const blocks: DocBlock[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      const pageIndex = pageNumber - 1;
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 }) as PageViewport;
      const pageBox: Box = { x0: 0, y0: 0, x1: viewport.width, y1: viewport.height };

      const textContent = await page.getTextContent();
      const segments = toSegments(textContent.items as TextItem[], viewport);

      if (isScannedPage(segments, pageBox)) {
        scannedPages.push(pageIndex);
        opts?.onProgress?.(Math.round((pageNumber / pageCount) * 100));
        continue;
      }

      const opList = await page.getOperatorList();
      const rules = extractRules(opList, viewport);
      const regions = orderSegments(segments, pageBox);

      // Ruled tables are detected page-wide (they need the page's full rule
      // set to reconstruct their grid). Their segments are filtered out of
      // each region — by identity, never by cloning — before borderless
      // detection runs on it, so the same cells can't be "discovered" twice.
      const ruled = detectRuledTable(rules, segments, pageBox);
      const ruledSegments = new Set(ruled ? ruled.segments : []);
      const regionsForBorderless = regions.map((region) =>
        region.filter((s) => !ruledSegments.has(s)),
      );
      const borderlessTables = detectBorderlessTablesPerRegion(regionsForBorderless);

      const candidateTables = ruled ? [ruled, ...borderlessTables] : borderlessTables;
      const tables = dedupeTables(candidateTables);

      blocks.push(...classify(regions, tables));

      opts?.onProgress?.(Math.round((pageNumber / pageCount) * 100));
    }
  } finally {
    await doc.destroy();
  }

  return { blocks, pageCount, scannedPages };
}
