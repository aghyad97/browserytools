import type { Segment } from "./segments";

/**
 * Recover reading order from positioned Segments by pure geometry.
 *
 * The algorithm is a recursive XY-cut, but deliberately **column-first**:
 * at every level we look for a vertical gutter BEFORE we consider horizontal
 * bands. This ordering is not a style preference, it is a correctness
 * requirement measured in the Wave 7 spike (docs/superpowers/specs/
 * 2026-07-19-wave-7-spike-findings.md, "Spike A", trap 1):
 *
 *   The obvious algorithm — split into horizontal bands first, then find
 *   columns within each band — SCRAMBLES paragraph order while STILL emitting
 *   section markers in the correct sequence. On a two-column page it
 *   interleaves the columns band by band, so a paragraph high in the right
 *   column is emitted before a heading lower in the left column. A test that
 *   only checks marker order passes against that broken output. The test for
 *   this module therefore asserts the FULL ordered sequence.
 *
 * A full-width title spans both columns and blocks the gutter, so the gutter
 * search is retried with the top k segments peeled off as a header band
 * (k = 0..6). The same problem exists at the other end of the page: a centred
 * page number, running footer or footnote marker sits squarely in the gutter's
 * x-range and blocks the channel just as effectively — and a top-only peel can
 * never reach it. The search is therefore symmetric, also peeling j segments
 * off the bottom (j = 0..3). The first (k, j) that yields >= 2 columns of >= 2
 * segments wins, searched by smallest total peel first so the existing
 * "smallest peel wins" bias is preserved. Only when no (k, j) produces a gutter
 * do we fall back to horizontal bands.
 *
 * All geometry is PDF user space: origin bottom-left, y increases UPWARD.
 * "Top of the page" therefore means LARGER y, and reading order within a
 * region is y descending.
 */

/** Minimum width of a vertical gutter, in pt. Narrower gaps are word/kerning space. */
const MIN_GUTTER_WIDTH = 12;

/**
 * A gutter must be crossed by ZERO segments over the full height of the region.
 *
 * The plan specified "clear over >= 80% of the region height". That was measured
 * to be too permissive and is deliberately tightened here: on doc2-twocol the
 * full-width title interrupts the channel for only ~8% of the region height, so
 * at an 80% threshold the gutter is found at k=0 and the title is absorbed into
 * whichever column its centre happens to fall in — the header peel never fires,
 * and whether the title ends up as its own region falls through to the band
 * splitter, where it landed within 0.001pt of the threshold. Requiring a clean
 * channel makes the peel do the job it exists for, deterministically.
 *
 * Full-width elements at the extremes of the region are reached by the header
 * and footer peels. Anything a peel cannot reach (a mid-page figure caption,
 * say) is handled by the band fallback, which separates it into its own band;
 * the gutter search then succeeds inside the body band.
 */
const MAX_GUTTER_CROSSINGS = 0;

/** Max number of top segments peeled off as a header band while hunting a gutter. */
const MAX_HEADER_PEEL = 6;

/**
 * Max number of bottom segments peeled off as a footer band while hunting a
 * gutter. Smaller than the header peel because footers are structurally
 * shallow — a page number, optionally with a running title or a rule — whereas
 * a masthead can stack a logo, kicker, headline, byline and dateline. Keeping
 * this tight also keeps the (k, j) search bounded at 7 x 4 = 28 attempts.
 */
const MAX_FOOTER_PEEL = 3;

/** A gutter must leave at least this many segments on each side to be believable. */
const MIN_COLUMN_SEGMENTS = 2;

/**
 * A horizontal band break requires a vertical gap of at least this many median
 * line heights. Paragraph spacing in real documents runs ~1.5-2x line height,
 * so this must sit above 2 to stop ordinary paragraph gaps from shattering a
 * single column into a region per paragraph — while staying low enough to
 * separate genuinely distinct page zones.
 *
 * 2.5 is measured, not guessed. Against the fixtures it clears every boundary
 * by >= 4pt: doc1 paragraph gaps 24.5pt vs a 30pt threshold (no split, correct),
 * doc4 line-group gaps 28.2pt vs 32.5pt (no split, correct), doc2's title-to-body
 * gap 31.5pt vs 26.2pt (splits, correct). At 3.0 that last case sits 0.001pt from
 * the threshold — a coin flip on floating-point noise.
 */
const BAND_GAP_LINE_HEIGHTS = 2.5;
const MIN_BAND_GAP = 20; // pt — floor for tiny-font pages

/**
 * Baseline tolerance for grouping segments into one visual line, in em.
 * Exported so blocks.ts's line-grouping (groupLines) can share it exactly
 * instead of maintaining its own copy that could silently drift out of sync.
 */
export const LINE_TOLERANCE_EM = 0.4;
export const MIN_LINE_TOLERANCE = 1.5; // pt

/** Recursion guard. Real layouts nest a handful of levels at most. */
const MAX_DEPTH = 12;

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Order a page's segments into regions.
 *
 * @param segments positioned segments from `toSegments` (any order)
 * @param pageBox  the page box in PDF user space; used to bound the geometry
 *                 defensively — segments outside it are dropped rather than
 *                 dragging the region bounding box (and therefore every
 *                 height ratio) off the page.
 * @returns ordered regions; each region's segments in reading order.
 */
export function orderSegments(segments: Segment[], pageBox: Box): Segment[][] {
  const usable = segments.filter((s) => isUsable(s, pageBox));
  if (usable.length === 0) return [];
  const out: Segment[][] = [];
  cut(usable, out, 0);
  return out.filter((region) => region.length > 0);
}

function isUsable(s: Segment, pageBox: Box): boolean {
  if (!Number.isFinite(s.x) || !Number.isFinite(s.y)) return false;
  if (!Number.isFinite(s.w) || !Number.isFinite(s.h)) return false;
  // Tolerate a small overhang: glyph origins can legitimately sit slightly
  // outside the declared page box.
  const margin = 5;
  const cx = s.x + s.w / 2;
  return (
    cx >= pageBox.x0 - margin &&
    cx <= pageBox.x1 + margin &&
    s.y >= pageBox.y0 - margin &&
    s.y <= pageBox.y1 + margin
  );
}

/**
 * Recursive cut: gutter first (with symmetric header/footer peel), horizontal
 * bands as fallback.
 */
function cut(segments: Segment[], out: Segment[][], depth: number): void {
  if (segments.length <= 1 || depth >= MAX_DEPTH) {
    out.push(sortRegion(segments));
    return;
  }

  // Top-to-bottom order for the peels. Ties on baseline are broken by x so the
  // peel is deterministic. y descends, so the header is the head of this array
  // and the footer is its tail.
  const byTop = [...segments].sort((a, b) => b.y - a.y || a.x - b.x);
  const n = byTop.length;

  // Search (k, j) by smallest total peel first, and within a total by smallest
  // k — so k=0,j=0 is still tried first and the pre-existing "smallest peel
  // wins" bias is preserved. Bounded at (MAX_HEADER_PEEL + 1) *
  // (MAX_FOOTER_PEEL + 1) attempts regardless of segment count.
  for (let total = 0; total <= MAX_HEADER_PEEL + MAX_FOOTER_PEEL; total++) {
    for (let k = Math.max(0, total - MAX_FOOTER_PEEL); k <= Math.min(total, MAX_HEADER_PEEL); k++) {
      const j = total - k;
      // Leave at least enough segments behind for two believable columns.
      if (k + j > n - MIN_COLUMN_SEGMENTS * 2) continue;

      const rest = byTop.slice(k, n - j);
      const split = findGutter(rest);
      if (!split) continue;

      // Emission order: header band, then the columns in reading order, then
      // the footer band. Peeled segments are re-emitted, never dropped.
      if (k > 0) cut(byTop.slice(0, k), out, depth + 1);
      for (const column of split) cut(column, out, depth + 1);
      if (j > 0) cut(byTop.slice(n - j), out, depth + 1);
      return;
    }
  }

  const bands = splitBands(segments);
  if (bands.length > 1) {
    for (const band of bands) cut(band, out, depth + 1);
    return;
  }

  out.push(sortRegion(segments));
}

/**
 * Find the dominant vertical gutter and split the segments into columns.
 *
 * Returns the columns already in reading order (left-to-right, or
 * right-to-left when the segments are majority `rtl`), or null when no gutter
 * qualifies.
 */
function findGutter(segments: Segment[]): Segment[][] | null {
  if (segments.length < MIN_COLUMN_SEGMENTS * 2) return null;

  const bounds = boundsOf(segments);
  const height = bounds.y1 - bounds.y0;
  const width = bounds.x1 - bounds.x0;
  if (height <= 0 || width < MIN_GUTTER_WIDTH) return null;

  // Project every segment's x-extent onto 1pt-wide bins via a difference array,
  // giving the number of segments crossing each bin in O(segments + bins). A bin
  // is "open" when nothing crosses it — a clear floor-to-ceiling channel.
  const binCount = Math.ceil(width);
  const delta = new Int32Array(binCount + 1);
  for (const s of segments) {
    // A zero-width segment (an Arabic combining mark, a stray positioning item)
    // occupies no horizontal space and must not block a channel. This has to be
    // an explicit skip: for w = 0 and a non-integer x — the normal case — the
    // floor/ceil below collapse to from === to and would block one whole bin,
    // which is enough to fragment a wide gutter into two sub-threshold pieces.
    if (!(s.w > 0)) continue;
    const from = Math.max(0, Math.floor(s.x - bounds.x0));
    const to = Math.min(binCount - 1, Math.ceil(s.x + s.w - bounds.x0) - 1);
    if (to < from) continue;
    delta[from] += 1;
    delta[to + 1] -= 1;
  }
  const open: boolean[] = new Array(binCount);
  let crossings = 0;
  for (let i = 0; i < binCount; i++) {
    crossings += delta[i];
    open[i] = crossings <= MAX_GUTTER_CROSSINGS;
  }

  // Collect every maximal run of open bins that is wide enough AND actually
  // separates two believable columns.
  const regionCentre = (bounds.x0 + bounds.x1) / 2;
  interface Candidate {
    centre: number;
    width: number;
    columns: [Segment[], Segment[]];
  }
  const candidates: Candidate[] = [];
  let runStart = -1;
  for (let i = 0; i <= binCount; i++) {
    if (i < binCount && open[i]) {
      if (runStart < 0) runStart = i;
      continue;
    }
    if (runStart >= 0) {
      const x0 = bounds.x0 + runStart;
      const x1 = bounds.x0 + i;
      const runWidth = x1 - x0;
      if (runWidth >= MIN_GUTTER_WIDTH) {
        const centre = (x0 + x1) / 2;
        const columns = splitAt(segments, centre);
        if (columns) candidates.push({ centre, width: runWidth, columns });
      }
      runStart = -1;
    }
  }
  if (candidates.length === 0) return null;

  // Widest gutter wins; ties break toward the one nearest the horizontal
  // centre of the region (the likelier real gutter). With >2 columns the
  // remaining gutters are found by recursing into each half.
  let best = candidates[0];
  for (const candidate of candidates.slice(1)) {
    const wider = candidate.width > best.width;
    const equallyWideButMoreCentral =
      candidate.width === best.width &&
      Math.abs(candidate.centre - regionCentre) < Math.abs(best.centre - regionCentre);
    if (wider || equallyWideButMoreCentral) best = candidate;
  }

  const [left, right] = best.columns;
  return isRtlMajority(segments) ? [right, left] : [left, right];
}

/**
 * Assign segments to the left/right side of a gutter by their centre x.
 * Returns null unless both sides carry enough content to be a real column —
 * this is what stops a ragged right margin (one long line reaching past all
 * the others) from reading as a gutter on a single-column page.
 *
 * Zero-width segments are assigned to a side (nothing is ever dropped) but do
 * NOT count toward that believability threshold: they carry no horizontal
 * evidence, exactly as they carry none in the crossing computation. Counting
 * them lets a side holding one real line plus a stray combining mark pass as a
 * two-segment column — measured on doc4-arabic, where two combining marks
 * either side of a wide margin gap made a single-column RTL page split.
 */
function splitAt(segments: Segment[], gutterCentre: number): [Segment[], Segment[]] | null {
  const left: Segment[] = [];
  const right: Segment[] = [];
  let leftReal = 0;
  let rightReal = 0;
  for (const s of segments) {
    if (s.x + s.w / 2 < gutterCentre) {
      left.push(s);
      if (s.w > 0) leftReal++;
    } else {
      right.push(s);
      if (s.w > 0) rightReal++;
    }
  }
  if (leftReal < MIN_COLUMN_SEGMENTS || rightReal < MIN_COLUMN_SEGMENTS) return null;
  return [left, right];
}

/**
 * Fallback split: group segments into horizontal bands separated by a vertical
 * gap far larger than ordinary paragraph spacing. Bands are returned top to
 * bottom.
 */
function splitBands(segments: Segment[]): Segment[][] {
  const medianHeight = median(segments.map((s) => (s.h > 0 ? s.h : s.fontSize)));
  const minGap = Math.max(BAND_GAP_LINE_HEIGHTS * medianHeight, MIN_BAND_GAP);

  const sorted = [...segments].sort((a, b) => b.y - a.y);
  const bands: Segment[][] = [];
  let current: Segment[] = [];
  let bandBottom = Number.POSITIVE_INFINITY;

  for (const s of sorted) {
    const top = s.y + Math.max(s.h, 0);
    if (current.length > 0 && bandBottom - top > minGap) {
      bands.push(current);
      current = [];
      bandBottom = Number.POSITIVE_INFINITY;
    }
    current.push(s);
    bandBottom = Math.min(bandBottom, s.y);
  }
  if (current.length > 0) bands.push(current);
  return bands;
}

/**
 * Order a leaf region: lines top to bottom (y descending, because the PDF
 * origin is bottom-left), and within a line left to right — or right to left
 * for a line whose segments are majority `rtl`.
 */
function sortRegion(segments: Segment[]): Segment[] {
  if (segments.length <= 1) return [...segments];

  const tolerance = Math.max(
    MIN_LINE_TOLERANCE,
    LINE_TOLERANCE_EM * median(segments.map((s) => s.fontSize)),
  );
  const byBaseline = [...segments].sort((a, b) => b.y - a.y);

  const lines: Segment[][] = [];
  let anchor = Number.NaN;
  for (const s of byBaseline) {
    // Anchor on the first member rather than a running mean so a long run of
    // slightly-drifting baselines cannot creep into the next line.
    if (lines.length === 0 || Math.abs(anchor - s.y) > tolerance) {
      lines.push([s]);
      anchor = s.y;
    } else {
      lines[lines.length - 1].push(s);
    }
  }

  const ordered: Segment[] = [];
  for (const line of lines) {
    const rtl = isRtlMajority(line);
    line.sort((a, b) => (rtl ? b.x - a.x : a.x - b.x));
    ordered.push(...line);
  }
  return ordered;
}

function isRtlMajority(segments: Segment[]): boolean {
  let rtl = 0;
  for (const s of segments) if (s.dir === "rtl") rtl++;
  return rtl * 2 > segments.length;
}

function boundsOf(segments: Segment[]): Box {
  let x0 = Number.POSITIVE_INFINITY;
  let y0 = Number.POSITIVE_INFINITY;
  let x1 = Number.NEGATIVE_INFINITY;
  let y1 = Number.NEGATIVE_INFINITY;
  for (const s of segments) {
    x0 = Math.min(x0, s.x);
    y0 = Math.min(y0, s.y);
    x1 = Math.max(x1, s.x + Math.max(s.w, 0));
    y1 = Math.max(y1, s.y + Math.max(s.h, 0));
  }
  return { x0, y0, x1, y1 };
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
