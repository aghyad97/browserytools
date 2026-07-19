import type { Segment } from "./segments";
import type { Line } from "./rules";

/**
 * Table detection by pure geometry — no model, no content heuristics.
 *
 * Two independent detectors, matching the two ways real producers draw
 * tables (measured in the Wave 7 spike — see docs/superpowers/specs/
 * 2026-07-19-wave-7-spike-findings.md, "Spike A"):
 *
 * - `detectRuledTable` — the table has drawn borders, so the grid comes from
 *   the ruling lines `extractRules` recovered, and text is dropped into
 *   cells by centroid.
 * - `detectBorderlessTable` — no borders at all, so the grid has to be
 *   inferred from the alignment of the text itself.
 *
 * All geometry is PDF user space: origin bottom-left, y increases UPWARD.
 * "Top of the page" therefore means LARGER y, and rows are emitted in
 * y-descending order.
 */

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface DetectedTable {
  /** Cell text, row-major, top-to-bottom then left-to-right. Empty cells are "". */
  rows: string[][];
  /** True when the grid came from drawn ruling lines, false when inferred from alignment. */
  ruled: boolean;
  /** Bounding box of the detected table in PDF user space. */
  box: Box;
}

/**
 * Tolerance for merging near-collinear ruling lines into one logical grid
 * line, in pt.
 *
 * Rules arrive UNMERGED. Chrome's print-to-PDF path emits one filled rect per
 * CELL EDGE rather than one per logical grid line, so doc3-tables.pdf yields
 * 15 horizontal and 16 vertical raw rule segments for what is logically a
 * 5h x 4v grid. Overlapping and duplicated rules are expected input, not a
 * defect: without clustering, every cell edge becomes its own grid line and
 * the reconstructed table is nonsense.
 */
const RULE_CLUSTER_TOL = 2;

/**
 * A ruled table needs at least 2 clustered rules on EACH axis (i.e. at least
 * one full cell). This bar is what stops a lone stray clip-rect or underline
 * on a prose page from registering as a table.
 */
const MIN_RULES_PER_AXIS = 2;

/** A borderless table needs at least this many consecutive aligned rows. */
const MIN_BORDERLESS_ROWS = 3;

/** A borderless table row needs at least this many segments (i.e. >= 2 columns). */
const MIN_ROW_SEGMENTS = 2;

/** Small slack when bounds-checking rules against the page box, in pt. */
const PAGE_BOX_MARGIN = 1;

/**
 * Column-alignment tolerance for borderless detection, in pt.
 *
 * MUST be derived from the font size, never fixed. A fixed tolerance below
 * 3pt SILENTLY DROPS THE HEADER ROW: a bold header's glyph bearings shift its
 * left edge by ~2.1pt relative to the data rows below it, so the header fails
 * the alignment check, the run starts one row late, and the table comes back
 * headerless with no error anywhere. The 3pt floor covers that case at small
 * font sizes; the 0.3x term scales it for large ones.
 */
function colTol(a: Segment, b: Segment): number {
  return Math.max(3, 0.3 * Math.max(a.fontSize, b.fontSize));
}

function centroidX(s: Segment): number {
  return s.x + s.w / 2;
}

function centroidY(s: Segment): number {
  return s.y + s.h / 2;
}

/** A rule's position on the axis it is thin in. */
function hPosition(line: Line): number {
  return (line.y0 + line.y1) / 2;
}

function vPosition(line: Line): number {
  return (line.x0 + line.x1) / 2;
}

/** Is this line entirely inside the page box (with a little slack)? */
function withinPage(line: Line, pageBox: Box): boolean {
  if (
    !Number.isFinite(line.x0) ||
    !Number.isFinite(line.y0) ||
    !Number.isFinite(line.x1) ||
    !Number.isFinite(line.y1)
  ) {
    return false;
  }
  return (
    line.x0 >= pageBox.x0 - PAGE_BOX_MARGIN &&
    line.x1 <= pageBox.x1 + PAGE_BOX_MARGIN &&
    line.y0 >= pageBox.y0 - PAGE_BOX_MARGIN &&
    line.y1 <= pageBox.y1 + PAGE_BOX_MARGIN
  );
}

/**
 * Collapse near-equal positions into one representative each (their mean),
 * returned ascending. Values within `tol` of the running cluster join it.
 */
function clusterPositions(values: number[], tol: number): number[] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const out: number[] = [];
  let bucket: number[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const value = sorted[i];
    // Compare against the bucket's current mean rather than the previous raw
    // value, so a long chain of 1pt-apart rules cannot drift into one cluster.
    const mean = bucket.reduce((a, b) => a + b, 0) / bucket.length;
    if (Math.abs(value - mean) <= tol) {
      bucket.push(value);
    } else {
      out.push(mean);
      bucket = [value];
    }
  }
  out.push(bucket.reduce((a, b) => a + b, 0) / bucket.length);
  return out;
}

/** Index of the band `value` falls into, given ascending boundaries; -1 if outside. */
function bandIndex(boundaries: number[], value: number): number {
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (value >= boundaries[i] && value <= boundaries[i + 1]) return i;
  }
  return -1;
}

/**
 * Detect a table whose grid is drawn with ruling lines.
 *
 * Algorithm:
 * 1. Filter rules to those inside `pageBox`. This is NOT optional:
 *    `extractRules` deliberately returns raw, unfiltered coordinates (so its
 *    own inverted-CTM regression test can observe garbage like y = -1731
 *    instead of having it silently clipped away). A real-world PDF with a bad
 *    CTM would otherwise poison the grid with phantom bands.
 * 2. Cluster each axis within 2pt into logical grid lines (see
 *    RULE_CLUSTER_TOL — rules arrive one per cell edge, not per grid line).
 * 3. Require >= 2 clustered rules on each axis, else this is not a table.
 * 4. Assign each segment to a cell by its CENTROID, and join multiple
 *    segments landing in one cell with a space, in reading order.
 *
 * @returns the table, or null if the rules do not describe a grid or no
 *          text lands inside it.
 */
export function detectRuledTable(
  rules: { h: Line[]; v: Line[] },
  segments: Segment[],
  pageBox: Box,
): DetectedTable | null {
  const hLines = rules.h.filter((line) => withinPage(line, pageBox));
  const vLines = rules.v.filter((line) => withinPage(line, pageBox));

  const rowBoundaries = clusterPositions(hLines.map(hPosition), RULE_CLUSTER_TOL);
  const colBoundaries = clusterPositions(vLines.map(vPosition), RULE_CLUSTER_TOL);

  if (rowBoundaries.length < MIN_RULES_PER_AXIS) return null;
  if (colBoundaries.length < MIN_RULES_PER_AXIS) return null;

  const rowCount = rowBoundaries.length - 1;
  const colCount = colBoundaries.length - 1;

  // cells[r][c] collects the segments landing in that cell, so multiple runs
  // in one cell can be joined afterwards in reading order.
  const cells: Segment[][][] = Array.from({ length: rowCount }, () =>
    Array.from({ length: colCount }, () => [] as Segment[]),
  );

  let placed = 0;
  for (const s of segments) {
    // rowBoundaries ascend in y, but rows read top-to-bottom (y descending),
    // so band 0 is the BOTTOM row and the index has to be flipped.
    const band = bandIndex(rowBoundaries, centroidY(s));
    const col = bandIndex(colBoundaries, centroidX(s));
    if (band < 0 || col < 0) continue;
    cells[rowCount - 1 - band][col].push(s);
    placed++;
  }

  if (placed === 0) return null;

  const rows = cells.map((row) =>
    row.map((cell) =>
      [...cell]
        .sort((a, b) => centroidY(b) - centroidY(a) || a.x - b.x)
        .map((s) => s.text.trim())
        .filter((t) => t.length > 0)
        .join(" "),
    ),
  );

  return {
    rows,
    ruled: true,
    box: {
      x0: colBoundaries[0],
      y0: rowBoundaries[0],
      x1: colBoundaries[colBoundaries.length - 1],
      y1: rowBoundaries[rowBoundaries.length - 1],
    },
  };
}

/** Group segments into visual rows by vertical overlap, ordered top-to-bottom. */
function groupRows(segments: Segment[]): Segment[][] {
  const usable = segments.filter(
    (s) => Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.h),
  );
  const sorted = [...usable].sort((a, b) => centroidY(b) - centroidY(a));
  const rows: Segment[][] = [];
  let current: Segment[] = [];
  let top = 0;
  let bottom = 0;

  for (const s of sorted) {
    const sTop = s.y + s.h;
    const sBottom = s.y;
    if (current.length === 0) {
      current = [s];
      top = sTop;
      bottom = sBottom;
      continue;
    }
    // Overlap of the two vertical spans; > 0 means they share a visual line.
    const overlap = Math.min(top, sTop) - Math.max(bottom, sBottom);
    if (overlap > 0) {
      current.push(s);
      top = Math.max(top, sTop);
      bottom = Math.min(bottom, sBottom);
    } else {
      rows.push(current);
      current = [s];
      top = sTop;
      bottom = sBottom;
    }
  }
  if (current.length > 0) rows.push(current);
  return rows.map((row) => [...row].sort((a, b) => a.x - b.x));
}

/** Do two candidate rows have the same column structure? */
function rowsAlign(a: Segment[], b: Segment[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i].x - b[i].x) > colTol(a[i], b[i])) return false;
  }
  return true;
}

/**
 * Detect a table that has NO drawn borders, from text alignment alone.
 *
 * ============================ CONTRACT ============================
 * THIS FUNCTION MUST BE CALLED WITH THE SEGMENTS OF A SINGLE
 * READING-ORDER COLUMN REGION (one element of `orderSegments`'s result).
 * NEVER PASS IT A PAGE-WIDE SEGMENT LIST.
 *
 * Two-column prose IS, geometrically, an aligned grid: every left-column
 * line pairs with a right-column line at a similar baseline, and both
 * columns' left edges are perfectly constant down the page. Fed page-wide,
 * that page reads as a table with total confidence — this is a measured
 * false positive on doc2-twocol.pdf, not a hypothetical.
 *
 * The fix is architectural, not a heuristic. Inside a single column region,
 * a prose line is the only segment on its row, so the ">= 2 segments per
 * row" bar removes it and the region correctly yields null. A CONTENT
 * heuristic was tried instead and FAILED: the fill-ratio score ("table
 * cells don't fill their column, prose does") put the false positive at
 * 0.772, sitting BETWEEN the two true positives at 0.735 and 0.794. It is a
 * useless discriminator. Do not reintroduce it.
 * ==================================================================
 *
 * Algorithm: group segments into rows by vertical overlap → keep rows with
 * >= 2 segments → find the longest run of >= 3 consecutive kept rows whose
 * segment counts match and whose left edges align within `colTol`.
 *
 * @param segments one reading-order column region's segments (see contract).
 * @returns the table, or null if no aligned run qualifies.
 */
export function detectBorderlessTable(segments: Segment[]): DetectedTable | null {
  const candidates = groupRows(segments).filter((row) => row.length >= MIN_ROW_SEGMENTS);
  if (candidates.length < MIN_BORDERLESS_ROWS) return null;

  // Longest maximal run of mutually aligned consecutive rows. Ties keep the
  // first (topmost) run, so a page with two same-size tables is deterministic.
  let bestStart = 0;
  let bestLength = 0;
  let start = 0;
  for (let i = 1; i <= candidates.length; i++) {
    const breaks = i === candidates.length || !rowsAlign(candidates[i - 1], candidates[i]);
    if (!breaks) continue;
    const length = i - start;
    if (length > bestLength) {
      bestStart = start;
      bestLength = length;
    }
    start = i;
  }

  if (bestLength < MIN_BORDERLESS_ROWS) return null;

  const run = candidates.slice(bestStart, bestStart + bestLength);
  const rows = run.map((row) => row.map((s) => s.text.trim()));

  let x0 = Number.POSITIVE_INFINITY;
  let y0 = Number.POSITIVE_INFINITY;
  let x1 = Number.NEGATIVE_INFINITY;
  let y1 = Number.NEGATIVE_INFINITY;
  for (const row of run) {
    for (const s of row) {
      x0 = Math.min(x0, s.x);
      y0 = Math.min(y0, s.y);
      x1 = Math.max(x1, s.x + s.w);
      y1 = Math.max(y1, s.y + s.h);
    }
  }

  return { rows, ruled: false, box: { x0, y0, x1, y1 } };
}
