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

/**
 * Horizontal merge gap cap — the largest gap between two same-baseline runs
 * that still counts as "one piece of text". CRITICAL: this is what prevents
 * merging across a column gutter or a table's column gap. Columns in a
 * two-column layout share baselines, so merging runs into full lines (no gap
 * cap) pulls text across the gutter and destroys column separation, which
 * breaks every downstream reading-order/table task.
 *
 * MUST be derived from the font size, never fixed — same rule as tables.ts's
 * `colTol`, and for the same reason. A fixed 20pt cap SILENTLY DESTROYS THE
 * HEADER ROW of any ruled table whose column gap happens to fall under it:
 * the header cells merge into a single segment before tables.ts ever runs, so
 * the table comes back headerless with no error anywhere. This is not a
 * fixture-specific quirk — a 12pt table with ~1.5em column gaps (18.75pt in
 * doc6-twotables.pdf) is an entirely ordinary layout.
 *
 * Constants measured across every layout fixture (doc1-simple, doc2-twocol,
 * doc3-tables, doc4-arabic, doc5-twocol-footer, stroked-rules,
 * doc6-twotables, doc7-arabic-table), by collecting every same-baseline
 * adjacent run pair and splitting them into the two populations:
 *
 *   MUST merge (intra-line word/kerning gaps)  — max ratio 0.31 (doc4-arabic,
 *     4.05pt at 13pt font); most are ~0.00 (ligature/kerning splits).
 *   MUST NOT merge (table column gaps, gutters) — min ratio 1.56
 *     (doc6-twotables, 18.75pt at 12pt font); next 1.75 (doc3-tables, 21.0pt),
 *     then 3.14 (doc2-twocol gutter) and above.
 *
 * 0.75 sits between those populations with ~2.4x headroom below the smallest
 * true column gap and ~2.4x above the largest true word gap. The 6pt floor
 * only binds under an 8pt font, where a word gap is ~2.5pt and a column gap
 * ~12.5pt — so it keeps the same separation when the ratio term gets small.
 * Do not replace either constant with a fixed pt value.
 */
function maxMergeGap(fontSize: number): number {
  return Math.max(6, 0.75 * fontSize);
}

const WORD_GAP_FONT_RATIO = 0.2; // Relative, not a fixed pt value: natural word spacing
// scales with font size (a 30pt heading has a much wider natural word gap than 8pt body
// text), so a fixed-pt threshold would either fail to space large headings or falsely
// space tight small text. Gaps larger than 20% of the font size are treated as a real
// word boundary and get a reconstructed space; smaller gaps are kerning/ligature noise
// within a single word (near-zero, well under this threshold for any realistic font size).

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
 *   (|Δy| < 1pt) AND the horizontal gap between them is under the
 *   font-size-derived cap (see maxMergeGap).
 * - Runs are NEVER merged into full lines: a two-column layout has both
 *   columns sharing a baseline, so full-line merging would pull text across
 *   the gutter and destroy column separation. The gap cap is what prevents
 *   that — and, at table scale, what keeps a header row's cells apart.
 * - Merging reconstructs the word-separating space that whitespace-only
 *   items don't carry through (they're dropped, see the loop below): a gap
 *   bigger than 20% of the font size gets a single inserted space; smaller
 *   gaps (kerning/ligature splits) are concatenated directly. This matters
 *   for producers that emit prose as per-word TextItems rather than one
 *   TextItem per line.
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
    // the two content-bearing runs, which is what the merge cap is measured
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
    const gap = prev ? horizontalGap(prev, run) : 0;
    if (prev && canMerge(prev, run, gap)) {
      mergeInto(prev, run, gap);
    } else {
      segments.push({ ...run });
    }
  }
  return segments;
}

// The horizontal gap between the facing edges of two runs on the same baseline.
// Positive means a real gap; negative means slight overlap. Computed once per
// pair and threaded through to both canMerge (gutter/cap decision) and
// mergeInto (word-spacing decision) so the two never disagree about geometry.
function horizontalGap(prev: Segment, next: Segment): number {
  const prevRight = prev.x + prev.w;
  return next.x - prevRight;
}

function canMerge(prev: Segment, next: Segment, gap: number): boolean {
  if (Math.abs(prev.y - next.y) >= MAX_BASELINE_DELTA) return false;
  // Allow slight overlap (negative gap) as well as a positive gap up to the
  // cap. The cap scales with the larger of the two runs' font sizes, so a
  // heading's naturally wider word spacing is not mistaken for a column gap
  // and small-font table columns are not mistaken for word spacing.
  return gap < maxMergeGap(Math.max(prev.fontSize, next.fontSize));
}

function mergeInto(prev: Segment, next: Segment, gap: number): void {
  const prevRight = prev.x + prev.w;
  const nextRight = next.x + next.w;
  // dir is decided before mutating prev.text so the length comparison reflects
  // each run's own contribution, not the already-merged running total.
  if (next.text.length > prev.text.length) {
    prev.dir = next.dir;
  }
  const fontSize = Math.max(prev.fontSize, next.fontSize);
  // Reconstruct the word-separating space that whitespace-only TextItems
  // (dropped above) would otherwise have contributed. Use the absolute gap so
  // this is symmetric for rtl runs, where the "facing" edge can put the next
  // run's origin behind the previous run's right edge rather than ahead of it.
  const isWordGap = Math.abs(gap) > WORD_GAP_FONT_RATIO * fontSize;
  const alreadySpaced = /\s$/.test(prev.text) || /^\s/.test(next.text);
  prev.text += isWordGap && !alreadySpaced ? ` ${next.text}` : next.text;
  prev.w = Math.max(prevRight, nextRight) - prev.x;
  prev.h = Math.max(prev.h, next.h);
  prev.fontSize = fontSize;
}
