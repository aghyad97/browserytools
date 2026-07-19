import { LINE_TOLERANCE_EM, MIN_LINE_TOLERANCE } from "./reading-order";
import type { Segment } from "./segments";
import type { DetectedTable } from "./tables";

/**
 * Turn ordered reading-order regions plus detected tables into a semantic
 * document model: headings, paragraphs, lists and tables, in document order.
 *
 * This is pure classification by geometry (font size, indent, marker
 * punctuation) — no model, no content heuristics beyond what is documented
 * below. See the Wave 7 spike findings for why geometry-only recovery beats
 * an AI/OCR approach for digital-native PDFs.
 *
 * All geometry is PDF user space: origin bottom-left, y increases UPWARD.
 */

export type DocBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string; rtl?: boolean }
  | { type: "paragraph"; text: string; rtl?: boolean }
  | { type: "list"; ordered: boolean; items: string[]; rtl?: boolean }
  | { type: "table"; rows: string[][]; ruled: boolean };

/** A line's font size must exceed body size by this ratio to count as a heading. */
const HEADING_SIZE_RATIO = 1.12;

/** Tolerance for clustering "the same" font size across floating-point jitter, in pt. */
const SIZE_CLUSTER_TOL = 0.5;

/**
 * Minimum extra left indent (beyond the document's body indent) for a line
 * with NO leading marker to still count as a list-item candidate. Real-world
 * list indents run well above this (doc1-simple.pdf's fixture list is
 * indented 30pt beyond body text); this floor is deliberately loose so it
 * still catches list styles that omit a bullet glyph entirely and rely on
 * indentation alone (common in print-to-PDF output where the bullet is drawn
 * as a separate small vector glyph, not text).
 */
const LIST_INDENT_THRESHOLD = 10; // pt

/**
 * Minimum run length for an INDENT-ONLY list (no marker on any line) to be
 * emitted as a list at all, rather than demoted to ordinary paragraph
 * line(s). Indent alone is a weak signal — a wrapped block quote or a run of
 * indented captions keeps every line at the same left edge exactly as
 * consistently as a real list does, and nothing here checks line-length
 * variance, terminal punctuation, or capitalization continuity to tell them
 * apart. Requiring 3 lines (not 2) closes the most common false-positive
 * shape — a 2-line indented quotation — at zero cost to the fixtures:
 * doc1-simple.pdf's only real indent-driven list run has exactly 3 items.
 * Marker-detected lists (viaMarker) are exempt: a real bullet or number is
 * strong enough evidence on its own, so a genuine 2-item marked list still
 * emits as a list (see the `!candidate.viaMarker` guard at the call site).
 */
const MIN_INDENT_ONLY_LIST_RUN = 3;

/**
 * Max vertical gap allowed between two heading-sized lines of the SAME
 * clustered size for them to merge into one heading block, expressed as a
 * multiple of the larger line's font size.
 *
 * Measured against doc2-twocol.pdf's real two-line title ("On the Recovery
 * of Reading Order in Fixed-" / "Layout Documents", both 19pt): the gap
 * between the two baselines is 27.75pt, a ratio of 27.75 / 19 = 1.4605. 1.6
 * clears that with a comfortable ~9.5% margin so the genuine continuation
 * still merges, while sitting far below the gap between two genuinely
 * distinct same-level headings with nothing between them (e.g. an empty
 * first CV section: "Skills" immediately followed by "Experience") — that
 * gap reflects normal paragraph/section spacing, well above tight
 * line-to-line leading. The merge loop only ever considers literal
 * neighbors in the flattened item stream, so this ratio is the only guard
 * against merging two such headings.
 */
const HEADING_MERGE_GAP_RATIO = 1.6;

/**
 * Vertical gap between two consecutive body lines, as a multiple of the larger
 * line's font size, above which they belong to DIFFERENT paragraphs.
 *
 * Without this, every consecutive paragraph inside one reading-order region
 * merges into a single `<w:p>`. That is what produced the "ALPHA-END
 * BETA-START" defect found in real-browser verification of doc2-twocol.pdf:
 * a paragraph that ends at the bottom of column A continues at the top of
 * column B, and the NEXT paragraph (starting mid-column-B) was spliced onto
 * its tail. The region split was correct — both lines genuinely live in the
 * same column region — so a region-boundary check alone cannot catch it.
 *
 * Measured across the layout fixtures, over consecutive non-heading lines
 * within a single region:
 *
 *   SAME paragraph (line leading)  — 1.43, 1.50 (doc1/doc2/doc5 body),
 *     max 1.79 (doc4-arabic, 23.25pt at 13pt font).
 *   DIFFERENT paragraphs           — min 2.43 (doc2-twocol, 25.5pt at 10.5pt),
 *     then 2.50 (doc1, doc5) and 2.83 (doc4-arabic).
 *
 * 2.1 sits almost exactly midway between the two populations (~17% margin on
 * each side). Headings are handled separately and never reach this check.
 */
const PARAGRAPH_BREAK_GAP_RATIO = 2.1;

/**
 * Leading-marker regex for list items: a bullet glyph, a numeric marker
 * (`12)`, `3.`), or a single-letter marker (`a.`, `b)`), followed by
 * whitespace. Per spec — do not add more marker shapes without re-checking
 * the fixtures.
 */
const LIST_MARKER_RE = /^\s*([•·▪-]|\d+[.)]|[a-z][.)])\s+/i;

/**
 * A line ending in a letter followed by a hyphen — the shape a justified
 * paragraph leaves behind when a word is broken across a line break
 * ("Fixed-" / "layout"). The letter class is Unicode-aware (\p{L}) so this
 * also catches non-Latin scripts that hyphenate.
 */
const SOFT_HYPHEN_END_RE = /\p{L}-$/u;

/**
 * The next line begins with a lowercase letter. Used as the corroborating
 * signal for de-hyphenation: a broken word's tail is lowercase, whereas a
 * genuine end-of-line compound ("state-" / "Of-the-art" is not a thing, but
 * "Anglo-" / "Saxon" and "PDF-" / "Word" very much are) continues with a
 * capital, a digit, or another script's uppercase form.
 */
const LOWERCASE_START_RE = /^\p{Ll}/u;

/**
 * Join a document's visual lines back into one run of text.
 *
 * PDF has no concept of a soft hyphen: a word broken across a line break is
 * stored as a literal "-" at the end of one line and the remainder at the
 * start of the next. Joining unconditionally with a space (which is what this
 * did before) turns every such break into "word- rest" — visible in most
 * real-world justified prose, not just one fixture.
 *
 * The rule, in two parts:
 *
 * 1. A line ending in letter+hyphen is NEVER followed by a space. A trailing
 *    hyphen is always attached to what follows it — that is what makes it a
 *    break rather than a dash. This holds for both cases below.
 * 2. The hyphen itself is dropped only when the next line starts lowercase
 *    (a broken word's tail is lowercase). When the tail is capitalized, the
 *    hyphen is a genuine compound's own hyphen and is kept: doc2-twocol's
 *    real title "…in Fixed-" / "Layout Documents" rejoins as
 *    "…in Fixed-Layout Documents", hyphen intact, no stray space.
 *
 * Every other line pair joins with a single space, exactly as before.
 *
 * This is deliberately conservative but not lossless: a real hyphenated
 * compound whose tail is lowercase ("well-" / "known") is indistinguishable
 * from a soft break using geometry alone, and loses its hyphen — the same
 * trade every de-hyphenating extractor makes. Rejoining broken words is by
 * far the more common case in real prose.
 */
function joinLines(texts: string[]): string {
  let out = "";
  for (const text of texts) {
    if (out.length === 0) {
      out = text;
      continue;
    }
    if (SOFT_HYPHEN_END_RE.test(out)) {
      // No space either way; drop the hyphen only for a lowercase tail.
      out = LOWERCASE_START_RE.test(text) ? `${out.slice(0, -1)}${text}` : `${out}${text}`;
    } else {
      out = `${out} ${text}`;
    }
  }
  return out;
}

/** Column-alignment-style tolerance for grouping list items by indent, in pt (mirrors tables.ts colTol). */
function indentTolerance(a: number, b: number): number {
  return Math.max(3, 0.3 * Math.max(a, b));
}

interface LineInfo {
  /** The original Segment(s) making up this visual line — kept for rtl/majority checks. */
  segments: Segment[];
  text: string;
  /** Leftmost x among the line's segments — the visual left edge, regardless of dir. */
  x0: number;
  /** Topmost y among the line's segments. */
  y: number;
  fontSize: number;
  /** Index into the `regions` array this line was produced from. */
  regionIndex: number;
}

interface ListCandidate {
  ordered: boolean;
  text: string;
  /** True when a leading marker was matched; false when this is an indent-only candidate. */
  viaMarker: boolean;
}

export function classify(regions: Segment[][], tables: DetectedTable[]): DocBlock[] {
  // ==========================================================================
  // Identity-based exclusion (BINDING): a Set of the exact Segment objects
  // consumed by any table. Never re-derive this from `box` — see tables.ts's
  // DetectedTable.segments doc comment for why box is unsafe for exclusion.
  // Segments are never cloned anywhere in this module; references are passed
  // straight through so this Set lookup stays valid end to end.
  // ==========================================================================
  const excludedSegments = new Set<Segment>();
  for (const table of tables) {
    for (const s of table.segments) excludedSegments.add(s);
  }

  // Font-size statistics are computed from ALL input segments (including
  // those a table will consume) — "across all input" per spec. Excluding
  // table cells here would starve the statistics on a table-heavy page (see
  // doc3-tables.pdf, where the two heading lines are a small minority of the
  // page's segments once the tables are excluded from paragraph flow).
  const allSegments = regions.flat();
  const bodySize = computeBodySize(allSegments);
  const headingSizes = clusterDescending(
    allSegments.filter((s) => s.fontSize > HEADING_SIZE_RATIO * bodySize).map((s) => s.fontSize),
  );

  const headingClusterFor = (fontSize: number): number | null =>
    headingSizes.find((size) => Math.abs(size - fontSize) <= SIZE_CLUSTER_TOL) ?? null;

  // Build per-region lines from the SURVIVING (non-table) segments only. This
  // is the emission path — table text must never reach it, by identity.
  const allLines: LineInfo[] = [];
  regions.forEach((region, regionIndex) => {
    const filtered = region.filter((s) => !excludedSegments.has(s));
    if (filtered.length === 0) return;
    for (const lineSegments of groupLines(filtered)) {
      allLines.push(toLineInfo(lineSegments, regionIndex));
    }
  });

  const bodyIndent = computeBodyIndent(allLines, headingClusterFor);

  // Assign each table to the region that (by majority segment membership)
  // contributed its content, so it can be positioned among that region's
  // lines. Regions partition all page segments, so every table's segments
  // should land almost entirely in one region.
  const regionSets = regions.map((region) => new Set(region));
  const tableRegionIndex = (table: DetectedTable): number => {
    let best = 0;
    let bestCount = -1;
    regionSets.forEach((set, idx) => {
      let count = 0;
      for (const s of table.segments) if (set.has(s)) count++;
      if (count > bestCount) {
        bestCount = count;
        best = idx;
      }
    });
    return best;
  };

  type Item =
    | { kind: "line"; line: LineInfo }
    | { kind: "table"; table: DetectedTable; regionIndex: number; y: number };

  const items: Item[] = allLines.map((line): Item => ({ kind: "line", line }));
  for (const table of tables) {
    items.push({ kind: "table", table, regionIndex: tableRegionIndex(table), y: table.box.y1 });
  }
  // Region index is the primary sort key — it already encodes correct
  // document order (header, columns, footer, ...) from orderSegments. Within
  // a region, sort by y descending (top of page first) so a table lands
  // exactly where it visually sits among that region's text lines.
  items.sort((a, b) => {
    const ra = a.kind === "line" ? a.line.regionIndex : a.regionIndex;
    const rb = b.kind === "line" ? b.line.regionIndex : b.regionIndex;
    if (ra !== rb) return ra - rb;
    const ya = a.kind === "line" ? a.line.y : a.y;
    const yb = b.kind === "line" ? b.line.y : b.y;
    return yb - ya;
  });

  const listCandidateFor = (line: LineInfo): ListCandidate | null => {
    const markerMatch = line.text.match(LIST_MARKER_RE);
    if (markerMatch) {
      const marker = markerMatch[1];
      const ordered = /^\d/.test(marker) || /^[a-z][.)]$/i.test(marker);
      return { ordered, text: line.text.slice(markerMatch[0].length).trim(), viaMarker: true };
    }
    if (bodyIndent !== null && line.x0 - bodyIndent >= LIST_INDENT_THRESHOLD) {
      return { ordered: false, text: line.text, viaMarker: false };
    }
    return null;
  };

  const blocks: DocBlock[] = [];
  let paragraphBuffer: LineInfo[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    const text = joinLines(paragraphBuffer.map((l) => l.text)).trim();
    if (text.length > 0) {
      blocks.push({ type: "paragraph", text, ...rtlFlag(paragraphBuffer) });
    }
    paragraphBuffer = [];
  };

  // Single entry point for appending a line to the paragraph buffer, enforcing
  // both paragraph-break invariants:
  //
  // 1. Paragraphs never span a region boundary (only headings do — see the
  //    cross-region merge above).
  // 2. Paragraphs break on a vertical gap larger than normal line leading.
  //
  // Every caller that can hand a line to the paragraph buffer MUST go through
  // this so neither invariant can be bypassed by a path that forgets the check
  // (see the list-demotion branch below, which used to skip it).
  const pushParagraphLine = (ln: LineInfo) => {
    const prev = paragraphBuffer[paragraphBuffer.length - 1];
    if (prev && (prev.regionIndex !== ln.regionIndex || isParagraphBreak(prev, ln))) {
      flushParagraph();
    }
    paragraphBuffer.push(ln);
  };

  let i = 0;
  while (i < items.length) {
    const item = items[i];

    if (item.kind === "table") {
      flushParagraph();
      blocks.push({ type: "table", rows: item.table.rows, ruled: item.table.ruled });
      i++;
      continue;
    }

    const line = item.line;
    const headingSize = headingClusterFor(line.fontSize);

    if (headingSize !== null) {
      // Merge strictly adjacent heading-sized lines of the SAME clustered
      // size into one heading block (constraint: a multi-line heading can
      // arrive as multiple adjacent regions after a header-peel split).
      flushParagraph();
      const group: LineInfo[] = [line];
      let j = i + 1;
      while (j < items.length) {
        const next = items[j];
        if (next.kind !== "line") break;
        const nextSize = headingClusterFor(next.line.fontSize);
        if (nextSize === null || nextSize !== headingSize) break;
        const prev = group[group.length - 1];
        const gap = prev.y - next.line.y;
        if (gap > HEADING_MERGE_GAP_RATIO * Math.max(prev.fontSize, next.line.fontSize)) break;
        group.push(next.line);
        j++;
      }
      const text = joinLines(group.map((l) => l.text)).trim();
      blocks.push({
        type: "heading",
        level: levelOf(headingSizes, headingSize),
        text,
        ...rtlFlag(group),
      });
      i = j;
      continue;
    }

    const candidate = listCandidateFor(line);
    if (candidate) {
      const group: { line: LineInfo; info: ListCandidate }[] = [{ line, info: candidate }];
      let j = i + 1;
      while (j < items.length) {
        const next = items[j];
        if (next.kind !== "line") break;
        if (next.line.regionIndex !== line.regionIndex) break;
        if (headingClusterFor(next.line.fontSize) !== null) break;
        const nextCandidate = listCandidateFor(next.line);
        if (!nextCandidate) break;
        const first = group[0].line;
        const tol = indentTolerance(first.fontSize, next.line.fontSize);
        if (Math.abs(next.line.x0 - first.x0) > tol) break;
        group.push({ line: next.line, info: nextCandidate });
        j++;
      }
      if (group.length < MIN_INDENT_ONLY_LIST_RUN && !candidate.viaMarker) {
        // A short indent-only run is too weak a signal on its own — a
        // wrapped block quote or a lone indented caption/footnote satisfies
        // "consistently indented" exactly as well as a real list does.
        // Demote every line in the run to ordinary paragraph line(s) instead
        // of emitting a spurious list (each still goes through
        // pushParagraphLine so a run that happens to open a new region can't
        // splice its text onto the tail of the previous region's paragraph).
        for (const g of group) pushParagraphLine(g.line);
        i = j;
        continue;
      }
      flushParagraph();
      blocks.push({
        type: "list",
        ordered: group[0].info.ordered,
        items: group.map((g) => g.info.text),
        ...rtlFlag(group.map((g) => g.line)),
      });
      i = j;
      continue;
    }

    // Plain line: paragraphs never span a region boundary (only headings do).
    pushParagraphLine(line);
    i++;
  }
  flushParagraph();

  return blocks;
}

/**
 * Group a region's already-ordered segments into visual lines by baseline
 * proximity. Mirrors reading-order.ts's sortRegion line-grouping exactly
 * (same tolerance formula) but does not re-sort within a line — the input is
 * already in reading order.
 */
function groupLines(segments: Segment[]): Segment[][] {
  if (segments.length === 0) return [];
  const tolerance = Math.max(
    MIN_LINE_TOLERANCE,
    LINE_TOLERANCE_EM * median(segments.map((s) => s.fontSize)),
  );
  const lines: Segment[][] = [];
  let anchor = Number.NaN;
  for (const s of segments) {
    if (lines.length === 0 || Math.abs(anchor - s.y) > tolerance) {
      lines.push([s]);
      anchor = s.y;
    } else {
      lines[lines.length - 1].push(s);
    }
  }
  return lines;
}

function toLineInfo(segments: Segment[], regionIndex: number): LineInfo {
  const text = segments
    .map((s) => s.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const x0 = Math.min(...segments.map((s) => s.x));
  const y = Math.max(...segments.map((s) => s.y));
  const fontSize = Math.max(...segments.map((s) => s.fontSize));
  return { segments, text, x0, y, fontSize, regionIndex };
}

/**
 * Body font size = the size carrying the most CHARACTERS across all input
 * (not the most segments) — a few long body lines must outweigh many short
 * headings. Sizes are clustered within SIZE_CLUSTER_TOL to absorb
 * floating-point jitter from repeated hypot() calls on nominally identical
 * fonts.
 */
function computeBodySize(segments: Segment[]): number {
  const buckets: { size: number; chars: number }[] = [];
  for (const s of segments) {
    const chars = s.text.length;
    if (chars === 0) continue;
    let bucket = buckets.find((b) => Math.abs(b.size - s.fontSize) <= SIZE_CLUSTER_TOL);
    if (!bucket) {
      bucket = { size: s.fontSize, chars: 0 };
      buckets.push(bucket);
    }
    bucket.chars += chars;
  }
  if (buckets.length === 0) return 12; // arbitrary fallback; only reached on empty input
  buckets.sort((a, b) => b.chars - a.chars);
  return buckets[0].size;
}

/** Distinct font sizes, clustered within SIZE_CLUSTER_TOL, sorted descending. */
function clusterDescending(sizes: number[]): number[] {
  const sorted = [...new Set(sizes)].sort((a, b) => a - b);
  const clusters: number[] = [];
  for (const s of sorted) {
    const last = clusters[clusters.length - 1];
    if (last === undefined || s - last > SIZE_CLUSTER_TOL) clusters.push(s);
  }
  return clusters.sort((a, b) => b - a);
}

/** Level 1 for the largest distinct heading size, descending; capped at 3. */
function levelOf(headingSizesDescending: number[], size: number): 1 | 2 | 3 {
  const idx = headingSizesDescending.findIndex((s) => Math.abs(s - size) <= SIZE_CLUSTER_TOL);
  const rank = idx < 0 ? headingSizesDescending.length - 1 : idx;
  return (Math.min(Math.max(rank, 0), 2) + 1) as 1 | 2 | 3;
}

/**
 * The document's body left margin: the most common left edge (x0) among
 * non-heading lines. List detection measures indent RELATIVE to this. Ties
 * break toward the smallest x (the true left margin, not a ragged one).
 */
function computeBodyIndent(
  lines: LineInfo[],
  headingClusterFor: (fontSize: number) => number | null,
): number | null {
  const candidates = lines.filter((l) => headingClusterFor(l.fontSize) === null);
  if (candidates.length === 0) return null;
  const counts = new Map<number, number>();
  for (const l of candidates) {
    const key = Math.round(l.x0);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let bestKey = 0;
  let bestCount = -1;
  for (const [key, count] of counts) {
    if (count > bestCount || (count === bestCount && key < bestKey)) {
      bestKey = key;
      bestCount = count;
    }
  }
  return bestKey;
}

/**
 * Do two consecutive body lines sit far enough apart vertically to be separate
 * paragraphs? y decreases down the page, so `prev.y - next.y` is the drop from
 * one baseline to the next. A non-positive drop means the lines share a
 * baseline (or the caller handed them out of order) and is never a break.
 */
function isParagraphBreak(prev: LineInfo, next: LineInfo): boolean {
  const gap = prev.y - next.y;
  if (!(gap > 0)) return false;
  return gap > PARAGRAPH_BREAK_GAP_RATIO * Math.max(prev.fontSize, next.fontSize);
}

function rtlFlag(lines: LineInfo[]): { rtl?: true } {
  let rtl = 0;
  let total = 0;
  for (const line of lines) {
    for (const s of line.segments) {
      total++;
      if (s.dir === "rtl") rtl++;
    }
  }
  return total > 0 && rtl * 2 > total ? { rtl: true } : {};
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
