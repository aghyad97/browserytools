import { OPS } from "pdfjs-dist";
import type { PageViewport } from "pdfjs-dist";
import type { PDFOperatorList } from "pdfjs-dist/types/src/display/api";

/**
 * A ruling line recovered from the PDF's vector drawing operators, in PDF
 * user space (origin bottom-left, y increases upward) — the same coordinate
 * space `toSegments` produces (see ./segments.ts), so Task 4 can compare
 * rules and text segments directly with no extra transform.
 *
 * Normalized so x0 <= x1 and y0 <= y1 (the raw path geometry does not
 * guarantee a particular corner order — a rectangle's height or a stroked
 * line's direction can run either way).
 */
export interface Line {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** A 2D affine transform in PDF form: [a, b, c, d, e, f]. */
type Matrix = [number, number, number, number, number, number];

const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];

// A path is a "rule" (table border) when it is thin in one axis and long in
// the other. Measured classification from the Wave 7 spike — see
// docs/superpowers/specs/2026-07-19-wave-7-spike-findings.md, "Spike A".
const RULE_THIN_MAX_PT = 2;
const RULE_LONG_MIN_PT = 10;

/**
 * Compose a transform `m` into the current CTM `c`, with `m` applied FIRST.
 *
 * This is pdf.js's OPS.transform semantics exactly: `ctm' = ctm ∘ m`, i.e. a
 * point is transformed by `m` and then by the pre-existing `ctm` — NOT the
 * other way around. Getting this backwards is a SILENT bug: both orders
 * produce a numerically valid 6-number matrix, so nothing throws, but
 * coordinates land wildly off the page (measured: y ~= -1731 instead of
 * y ~= 94.5 on the spike's table fixture). See spike findings, "Spike A"
 * trap 5. This is exactly why there is a dedicated hand-computed unit test
 * for this function alone, independent of any PDF fixture.
 */
export function composeCtm(m: Matrix, c: Matrix): Matrix {
  return [
    m[0] * c[0] + m[1] * c[2],
    m[0] * c[1] + m[1] * c[3],
    m[2] * c[0] + m[3] * c[2],
    m[2] * c[1] + m[3] * c[3],
    m[4] * c[0] + m[5] * c[2] + c[4],
    m[4] * c[1] + m[5] * c[3] + c[5],
  ];
}

function applyCtm(ctm: Matrix, x: number, y: number): [number, number] {
  return [ctm[0] * x + ctm[2] * y + ctm[4], ctm[1] * x + ctm[3] * y + ctm[5]];
}

function toLine(ax: number, ay: number, bx: number, by: number): Line {
  return {
    x0: Math.min(ax, bx),
    y0: Math.min(ay, by),
    x1: Math.max(ax, bx),
    y1: Math.max(ay, by),
  };
}

/**
 * Decode one `constructPath` call's flat args into candidate path segments,
 * transformed into PDF user space by the CTM active when the path was built.
 *
 * `constructPath`'s args are `[opCodeArray, coordArray, minMax]` (a pdf.js
 * INTERNAL contract, no cross-major stability guarantee — pdfjs-dist is
 * pinned to 4.10.38 for this reason; see the shape-guard test). `coordArray`
 * is a FLAT stream indexed by op arity: rectangle consumes 4, moveTo/lineTo
 * consume 2, curveTo consumes 6, curveTo2/curveTo3 consume 4. Getting any of
 * these wrong desynchronizes every coordinate after the mistake.
 *
 * Two rule idioms are supported here, per the spike's measured finding that
 * real-world producers use both:
 * - **Filled thin rects** (`OPS.rectangle`) — what Chrome/CSS `border` emits.
 *   All 4 corners are transformed (not just 2 opposite ones) so a CTM with
 *   rotation still yields a correct axis-aligned bounding box.
 * - **Stroked lines** (`OPS.moveTo` / `OPS.lineTo`) — what LaTeX and Word
 *   emit. Each `lineTo` forms a segment from the current point to its
 *   target; multi-segment polylines (several `lineTo`s in a row) are walked
 *   edge by edge, so a bent path can still contribute individual h/v edges.
 *
 * `curveTo`/`curveTo2`/`curveTo3` are never rules (a rule is a straight
 * line) but their coordinates must still be consumed at the right arity to
 * keep the stream in sync, and their endpoint becomes the new current point.
 */
function segmentsFromConstructPath(opCodes: number[], coords: number[], ctm: Matrix): Line[] {
  const out: Line[] = [];
  let ci = 0;
  let current: [number, number] | null = null;

  for (const code of opCodes) {
    switch (code) {
      case OPS.rectangle: {
        const x = coords[ci];
        const y = coords[ci + 1];
        const w = coords[ci + 2];
        const h = coords[ci + 3];
        ci += 4;
        const corners: Array<[number, number]> = [
          [x, y],
          [x + w, y],
          [x + w, y + h],
          [x, y + h],
        ];
        let x0 = Number.POSITIVE_INFINITY;
        let y0 = Number.POSITIVE_INFINITY;
        let x1 = Number.NEGATIVE_INFINITY;
        let y1 = Number.NEGATIVE_INFINITY;
        for (const [px, py] of corners) {
          const [tx, ty] = applyCtm(ctm, px, py);
          x0 = Math.min(x0, tx);
          y0 = Math.min(y0, ty);
          x1 = Math.max(x1, tx);
          y1 = Math.max(y1, ty);
        }
        out.push({ x0, y0, x1, y1 });
        current = [x, y];
        break;
      }
      case OPS.moveTo: {
        const x = coords[ci];
        const y = coords[ci + 1];
        ci += 2;
        current = [x, y];
        break;
      }
      case OPS.lineTo: {
        const x = coords[ci];
        const y = coords[ci + 1];
        ci += 2;
        if (current) {
          const [ax, ay] = applyCtm(ctm, current[0], current[1]);
          const [bx, by] = applyCtm(ctm, x, y);
          out.push(toLine(ax, ay, bx, by));
        }
        current = [x, y];
        break;
      }
      case OPS.curveTo: {
        // Args: (x1,y1,x2,y2,x3,y3) — endpoint is the last pair.
        current = [coords[ci + 4], coords[ci + 5]];
        ci += 6;
        break;
      }
      case OPS.curveTo2:
      case OPS.curveTo3: {
        // Args: (x2,y2,x3,y3) for both variants — endpoint is the last pair.
        current = [coords[ci + 2], coords[ci + 3]];
        ci += 4;
        break;
      }
      default:
        // closePath and any other zero-coordinate path op: nothing to
        // consume, current point unchanged.
        break;
    }
  }

  return out;
}

function classify(line: Line): "h" | "v" | null {
  const dx = line.x1 - line.x0;
  const dy = line.y1 - line.y0;
  if (dx <= RULE_THIN_MAX_PT && dy >= RULE_LONG_MIN_PT) return "v";
  if (dy <= RULE_THIN_MAX_PT && dx >= RULE_LONG_MIN_PT) return "h";
  return null;
}

/**
 * Is `args` shaped like pdf.js's `constructPath` contract,
 * `[opCodeArray, coordArray, minMax]`? Guards against a future pdfjs-dist
 * upgrade silently changing this internal shape — without the guard, a
 * changed shape would make every `constructPath` op decode to zero segments,
 * and `extractRules` would quietly return no tables rather than erroring.
 */
function isConstructPathArgs(args: unknown): args is [number[], number[], number[]] {
  return (
    Array.isArray(args) &&
    args.length === 3 &&
    Array.isArray(args[0]) &&
    Array.isArray(args[1]) &&
    Array.isArray(args[2])
  );
}

/**
 * Extract horizontal and vertical ruling lines (table borders) from a page's
 * vector drawing operators.
 *
 * Walks `opList` maintaining a CTM stack (`OPS.save` pushes, `OPS.restore`
 * pops, `OPS.transform` composes via `composeCtm`), decodes every
 * `constructPath` call under the CTM active at that point, and classifies
 * each resulting straight edge as a rule when one dimension is <= 2pt and
 * the other is >= 10pt.
 *
 * `viewport` is accepted for interface symmetry with the rest of the layout
 * pipeline (`toSegments` takes one too) and because callers use it to bound
 * the result against the page box. It is deliberately NOT used here to
 * filter output: the whole point of the inverted-CTM regression test is to
 * observe raw, unclipped coordinates when composition is wrong (they land
 * far outside the page, e.g. y ~= -1731) — silently dropping out-of-bounds
 * results here would mask exactly the bug this module exists to avoid.
 */
export function extractRules(
  opList: PDFOperatorList,
  _viewport: PageViewport,
): { h: Line[]; v: Line[] } {
  const h: Line[] = [];
  const v: Line[] = [];

  const stack: Matrix[] = [];
  let ctm: Matrix = IDENTITY;

  const { fnArray, argsArray } = opList;
  for (let i = 0; i < fnArray.length; i++) {
    const fn = fnArray[i];
    const args = argsArray[i];

    if (fn === OPS.save) {
      stack.push(ctm);
    } else if (fn === OPS.restore) {
      const popped = stack.pop();
      if (popped) ctm = popped;
    } else if (fn === OPS.transform) {
      if (Array.isArray(args) && args.length === 6) {
        ctm = composeCtm(args as Matrix, ctm);
      }
    } else if (fn === OPS.constructPath) {
      if (!isConstructPathArgs(args)) continue;
      const [opCodes, coords] = args;
      const candidates = segmentsFromConstructPath(opCodes, coords, ctm);
      for (const line of candidates) {
        const bucket = classify(line);
        if (bucket === "h") h.push(line);
        else if (bucket === "v") v.push(line);
      }
    }
  }

  return { h, v };
}
