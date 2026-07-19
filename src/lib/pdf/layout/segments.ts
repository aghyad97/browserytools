import type { TextItem } from "pdfjs-dist/types/src/display/api";
import type { PageViewport } from "pdfjs-dist";

/**
 * A positioned run of text recovered from a pdf.js text layer. Geometry is
 * derived directly from the item's transform matrix — see toSegments below
 * for the exact rules (measured in the Wave 7 spike, do not deviate).
 */
export interface Segment {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  fontName: string;
  dir: "ltr" | "rtl";
}

const MAX_BASELINE_DELTA = 1; // pt — runs sharing a baseline within this are mergeable
const MAX_GAP = 20; // pt — horizontal gap cap. CRITICAL: prevents merging across a
// column gutter. Columns in a two-column layout share baselines, so merging
// runs into full lines (no gap cap) pulls text across the gutter and destroys
// column separation — this breaks every downstream reading-order/table task.
// Do not raise this without re-running the Wave 7 spike fixtures.

function normalizeDir(dir: string | undefined): "ltr" | "rtl" {
  return dir === "rtl" ? "rtl" : "ltr";
}

/**
 * A single positioned run derived 1:1 from one pdf.js TextItem, before any
 * adjacent-run merging.
 */
function itemToRun(item: TextItem): Segment {
  const transform = item.transform as number[];
  const fontSize = Math.hypot(transform[0], transform[1]);
  const x = transform[4];
  const y = transform[5];
  const h = item.height || fontSize;
  return {
    text: item.str,
    x,
    y,
    w: item.width,
    h,
    fontSize,
    fontName: item.fontName,
    dir: normalizeDir(item.dir),
  };
}

/**
 * Turn pdf.js text-content items into positioned Segments.
 *
 * Rules (measured in the Wave 7 spike — see docs/superpowers/specs/
 * 2026-07-19-wave-7-spike-findings.md, "Spike A"):
 * - fontSize = hypot(transform[0], transform[1]); origin x/y = transform[4]/[5].
 * - w from item.width; h from item.height, falling back to fontSize when 0.
 * - dir from item.dir, defaulting to "ltr".
 * - Adjacent runs merge into one segment ONLY when they share a baseline
 *   (|Δy| < 1pt) AND the horizontal gap between them is < 20pt.
 * - Runs are NEVER merged into full lines: a two-column layout has both
 *   columns sharing a baseline, so full-line merging would pull text across
 *   the gutter and destroy column separation. The 20pt gap cap is what
 *   prevents that.
 *
 * `viewport` is accepted for interface symmetry with the rest of the layout
 * pipeline (extractRules etc. also take a viewport) and as a defensive bound
 * — items with non-finite geometry, or origins clearly outside the page,
 * are dropped rather than passed downstream.
 */
export function toSegments(items: TextItem[], viewport: PageViewport): Segment[] {
  const runs: Segment[] = [];
  for (const item of items) {
    if (!item.str || item.str.trim().length === 0) continue;
    // Whitespace-only items are dropped, not merely skipped-but-counted:
    // Chrome's print-to-PDF path emits a synthetic "space" TextItem between
    // table cells whose reported width spans the FULL visual gap to the next
    // cell (an artifact of how it lays out table/grid columns), not real
    // character spacing. Letting that width extend a run's bounding box makes
    // adjacent cells look like they overlap ("gap" goes negative) and chains
    // into merging an entire table row into one segment. Dropping the item
    // outright makes the merge decision below compare the real endpoints of
    // the two content-bearing runs, which is what the 20pt cap is measured
    // against.
    const transform = item.transform as number[] | undefined;
    if (!transform || transform.length < 6) continue;
    const run = itemToRun(item);
    if (
      !Number.isFinite(run.x) ||
      !Number.isFinite(run.y) ||
      !Number.isFinite(run.fontSize) ||
      run.fontSize <= 0
    ) {
      continue;
    }
    // Defensive page-bounds guard: drop runs whose origin sits far outside
    // the page (e.g. off-canvas artifacts). A small margin tolerates fonts
    // whose glyph origin legitimately sits a few points beyond the box.
    const margin = 5;
    if (
      viewport &&
      Number.isFinite(viewport.width) &&
      Number.isFinite(viewport.height)
    ) {
      if (
        run.x < -margin ||
        run.x > viewport.width + margin ||
        run.y < -margin ||
        run.y > viewport.height + margin
      ) {
        continue;
      }
    }
    runs.push(run);
  }

  // Merge adjacent runs sharing a baseline with a small horizontal gap.
  // Iterate in the order pdf.js emitted them (content-stream order), which
  // is left-to-right within a line for the vast majority of producers.
  const segments: Segment[] = [];
  for (const run of runs) {
    const prev = segments[segments.length - 1];
    if (prev && canMerge(prev, run)) {
      mergeInto(prev, run);
    } else {
      segments.push({ ...run });
    }
  }
  return segments;
}

function canMerge(prev: Segment, next: Segment): boolean {
  if (Math.abs(prev.y - next.y) >= MAX_BASELINE_DELTA) return false;
  const prevRight = prev.x + prev.w;
  const gap = next.x - prevRight;
  // Allow slight overlap (negative gap) as well as a positive gap up to the cap.
  return gap < MAX_GAP;
}

function mergeInto(prev: Segment, next: Segment): void {
  const prevRight = prev.x + prev.w;
  const nextRight = next.x + next.w;
  // dir is decided before mutating prev.text so the length comparison reflects
  // each run's own contribution, not the already-merged running total.
  if (next.text.length > prev.text.length) {
    prev.dir = next.dir;
  }
  prev.text += next.text;
  prev.w = Math.max(prevRight, nextRight) - prev.x;
  prev.h = Math.max(prev.h, next.h);
  prev.fontSize = Math.max(prev.fontSize, next.fontSize);
}
