import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
// Node test env needs the legacy pdf.js entry (the browser build assumes a
// DOM canvas/worker environment). This file only ever calls
// getOperatorList() — no render() — so no canvas polyfill is needed. Same
// pattern as segments.test.ts.
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { extractRules, composeCtm, type Line } from "@/lib/pdf/layout/rules";
import type { PDFOperatorList } from "pdfjs-dist/types/src/display/api";
import type { PageViewport } from "pdfjs-dist";

const FIXTURES_DIR = path.join(process.cwd(), "src/__tests__/fixtures/pdf");

function loadFixtureBytes(name: string): Uint8Array {
  const buf = readFileSync(path.join(FIXTURES_DIR, name));
  // getDocument() DETACHES the buffer it is handed (transfers the underlying
  // ArrayBuffer to the worker). Passing a copy — not the original view — is
  // mandatory; reusing the original after this call reads as an empty/zeroed
  // buffer. This exact bug previously broke every PDF tool in an earlier wave.
  return new Uint8Array(buf);
}

async function rulesForPage(
  fixture: string,
  pageNumber = 1,
): Promise<{ rules: { h: Line[]; v: Line[] }; viewport: PageViewport; opList: PDFOperatorList }> {
  const data = loadFixtureBytes(fixture);
  const doc = await getDocument({ data: new Uint8Array(data) }).promise;
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const opList = await page.getOperatorList();
  const rules = extractRules(opList, viewport);
  await doc.destroy();
  return { rules, viewport, opList };
}

describe("extractRules — real fixtures", () => {
  it("finds >= 4 horizontal and >= 4 vertical rules for the ruled table on doc3-tables.pdf", async () => {
    const { rules } = await rulesForPage("doc3-tables.pdf");
    expect(rules.h.length).toBeGreaterThanOrEqual(4);
    expect(rules.v.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps every returned coordinate within the page box (inverted-CTM regression guard)", async () => {
    // This is the direct guard for trap 5 (spike findings, "Spike A"): the
    // buggy composition order (composing ctm INTO args instead of args INTO
    // ctm) still returns numbers — just wildly wrong ones, e.g. y ~= -1731
    // instead of y ~= 94.5 — with no exception thrown anywhere. Coordinate
    // sanity is therefore the only thing that catches it.
    const { rules, viewport } = await rulesForPage("doc3-tables.pdf");
    const all = [...rules.h, ...rules.v];
    expect(all.length).toBeGreaterThan(0); // don't let an empty result pass vacuously
    for (const line of all) {
      expect(line.x0).toBeGreaterThanOrEqual(0);
      expect(line.x1).toBeLessThanOrEqual(viewport.width);
      expect(line.y0).toBeGreaterThanOrEqual(0);
      expect(line.y1).toBeLessThanOrEqual(viewport.height);
    }
  });

  it("does not look like a table on doc1-simple.pdf (prose, no ruled table)", async () => {
    const { rules } = await rulesForPage("doc1-simple.pdf");
    // Task 4 keys on ">= 2 rules on BOTH axes" as its is-this-a-table signal;
    // doc1 must fail that bar on at least one axis. It may still contain a
    // stray clip rect or two (that's fine and expected — see brief), just
    // not enough on both axes to read as a ruled grid.
    const looksLikeTable = rules.h.length >= 2 && rules.v.length >= 2;
    expect(looksLikeTable).toBe(false);
  });

  it("constructPath args destructure as [Array, Array, Array] (pdf.js internal-contract shape guard)", async () => {
    // pdfjs-dist is pinned to an exact version (4.10.38) precisely because
    // this shape has no cross-major stability guarantee. If a future upgrade
    // changes it, every constructPath op silently decodes to zero segments
    // and extractRules quietly returns no tables — this test is what turns
    // that into a loud, specific failure instead.
    const { opList } = await rulesForPage("doc3-tables.pdf");
    const constructPathIndex = opList.fnArray.findIndex((fn) => fn === OPS.constructPath);
    expect(constructPathIndex).toBeGreaterThanOrEqual(0);
    const args = opList.argsArray[constructPathIndex];
    expect(Array.isArray(args)).toBe(true);
    expect(args).toHaveLength(3);
    expect(Array.isArray(args[0])).toBe(true); // opCodeArray
    expect(Array.isArray(args[1])).toBe(true); // coordArray
    expect(Array.isArray(args[2])).toBe(true); // minMax
  });
});

describe("extractRules — real fixture, stroked idiom (LaTeX/Word style)", () => {
  // stroked-rules.pdf is a hand-built fixture (see spike A) whose content
  // stream draws a 3-column x 3-row grid entirely with moveTo/lineTo/stroke
  // ("m"/"l"/"S") — the idiom LaTeX and Word emit, as opposed to doc3-tables
  // .pdf's filled-rect idiom (what Chrome/CSS `border` emits). Before this
  // fixture, the stroked path in segmentsFromConstructPath was only
  // exercised by synthetic operator lists — never by a real PDF, which is
  // the more likely place for a real regression to hide.
  //
  // Verified content stream (dumped from the fixture): 4 horizontal segments
  // at y = 700, 675, 650, 625 (each x=100->400) and 4 vertical segments at
  // x = 100, 200, 300, 400 (each y=625->700). It's a clean synthetic grid —
  // no per-cell-edge duplication like Chrome's rect-per-border output — so
  // exact counts and coordinates are safe to assert.

  it("finds exactly 4 horizontal and 4 vertical rules", async () => {
    const { rules } = await rulesForPage("stroked-rules.pdf");
    expect(rules.h).toHaveLength(4);
    expect(rules.v).toHaveLength(4);
  });

  it("recovers the correct h-line y-coordinates and v-line x-coordinates", async () => {
    const { rules } = await rulesForPage("stroked-rules.pdf");
    // Rules are unordered as extracted; sort before comparing. This is the
    // real payoff of the fixture: it proves the CTM handling on the stroked
    // path produces correct *coordinates*, not merely correct counts.
    const hYs = rules.h.map((l) => l.y0).sort((a, b) => a - b);
    const vXs = rules.v.map((l) => l.x0).sort((a, b) => a - b);
    const expectedYs = [625, 650, 675, 700];
    const expectedXs = [100, 200, 300, 400];
    for (let i = 0; i < expectedYs.length; i++) {
      expect(hYs[i]).toBeGreaterThan(expectedYs[i] - 1);
      expect(hYs[i]).toBeLessThan(expectedYs[i] + 1);
    }
    for (let i = 0; i < expectedXs.length; i++) {
      expect(vXs[i]).toBeGreaterThan(expectedXs[i] - 1);
      expect(vXs[i]).toBeLessThan(expectedXs[i] + 1);
    }
  });

  it("keeps every coordinate within the page box (inverted-CTM regression guard)", async () => {
    const { rules, viewport } = await rulesForPage("stroked-rules.pdf");
    const all = [...rules.h, ...rules.v];
    expect(all.length).toBeGreaterThan(0);
    for (const line of all) {
      expect(line.x0).toBeGreaterThanOrEqual(0);
      expect(line.x1).toBeLessThanOrEqual(viewport.width);
      expect(line.y0).toBeGreaterThanOrEqual(0);
      expect(line.y1).toBeLessThanOrEqual(viewport.height);
    }
  });
});

describe("composeCtm", () => {
  it("composes a scale+translate transform into a translated identity ctm (hand-computed)", () => {
    // m: scale x2, y3, then translate +5,+7. c: identity translated +10,+20.
    // m applied FIRST: point (0,0) -> m -> (5,7) -> c -> (15,27), and scale
    // factors multiply directly since c has no rotation/shear (1*2=2, 1*3=3).
    const m: [number, number, number, number, number, number] = [2, 0, 0, 3, 5, 7];
    const c: [number, number, number, number, number, number] = [1, 0, 0, 1, 10, 20];
    expect(composeCtm(m, c)).toEqual([2, 0, 0, 3, 15, 27]);
  });

  it("composes a rotation transform into a translated ctm (hand-computed, exercises off-diagonal terms)", () => {
    // m: 90deg CCW rotation about the origin, [0,1,-1,0,0,0] — point (1,0) -> (0,1).
    // c: identity translated +10 on x only.
    // Applying m then c to (1,0): m -> (0,1), then c -> (10,1). The composed
    // matrix must reproduce that directly.
    const m: [number, number, number, number, number, number] = [0, 1, -1, 0, 0, 0];
    const c: [number, number, number, number, number, number] = [1, 0, 0, 1, 10, 0];
    const composed = composeCtm(m, c);
    expect(composed).toEqual([0, 1, -1, 0, 10, 0]);
    // Cross-check by applying the composed matrix directly to (1,0).
    const [a, b, cc, d, e, f] = composed;
    const x = a * 1 + cc * 0 + e;
    const y = b * 1 + d * 0 + f;
    expect([x, y]).toEqual([10, 1]);
  });
});

describe("extractRules — synthetic operator lists (idiom + CTM coverage)", () => {
  function makeOpList(fnArray: number[], argsArray: unknown[]): PDFOperatorList {
    return { fnArray, argsArray } as unknown as PDFOperatorList;
  }
  const viewport = { width: 612, height: 792 } as PageViewport;

  it("detects a stroked moveTo/lineTo idiom (LaTeX/Word style) with no CTM transform", () => {
    // Horizontal stroked line: (10,50) -> (100,50), dx=90 dy=0.
    const hPath: [number[], number[], number[]] = [
      [OPS.moveTo, OPS.lineTo],
      [10, 50, 100, 50],
      [10, 50, 100, 50],
    ];
    // Vertical stroked line: (200,10) -> (200,80), dx=0 dy=70.
    const vPath: [number[], number[], number[]] = [
      [OPS.moveTo, OPS.lineTo],
      [200, 10, 200, 80],
      [200, 10, 200, 80],
    ];
    const opList = makeOpList(
      [OPS.constructPath, OPS.stroke, OPS.constructPath, OPS.stroke],
      [hPath, null, vPath, null],
    );
    const { h, v } = extractRules(opList, viewport);
    expect(h).toEqual([{ x0: 10, y0: 50, x1: 100, y1: 50 }]);
    expect(v).toEqual([{ x0: 200, y0: 10, x1: 200, y1: 80 }]);
  });

  it("applies the CTM stack (save/transform/restore) to a stroked line, then resets for the next path", () => {
    // save; transform scale x2,y2 translate +100,+100 (composed into identity
    // ctm, so the result IS that matrix — see composeCtm's first test).
    // constructPath: local (0,0)->(10,0), transformed -> (100,100)->(120,100):
    // dx=20 dy=0, a horizontal rule (local length doubled by the ctm's scale).
    const scaledHPath: [number[], number[], number[]] = [
      [OPS.moveTo, OPS.lineTo],
      [0, 0, 10, 0],
      [0, 0, 10, 0],
    ];
    // restore back to identity; constructPath: local (5,5)->(5,25), untouched
    // by any transform: dx=0 dy=20, a vertical rule, verifiable by eye.
    const identityVPath: [number[], number[], number[]] = [
      [OPS.moveTo, OPS.lineTo],
      [5, 5, 5, 25],
      [5, 5, 5, 25],
    ];
    const opList = makeOpList(
      [
        OPS.save,
        OPS.transform,
        OPS.constructPath,
        OPS.stroke,
        OPS.restore,
        OPS.constructPath,
        OPS.stroke,
      ],
      [null, [2, 0, 0, 2, 100, 100], scaledHPath, null, null, identityVPath, null],
    );
    const { h, v } = extractRules(opList, viewport);
    expect(h).toEqual([{ x0: 100, y0: 100, x1: 120, y1: 100 }]);
    expect(v).toEqual([{ x0: 5, y0: 5, x1: 5, y1: 25 }]);
  });

  it("detects a filled thin rect idiom (Chrome/CSS border style)", () => {
    // Local rect x=0,y=0,w=1,h=30 under identity ctm -> a vertical rule.
    const rectPath: [number[], number[], number[]] = [[OPS.rectangle], [0, 0, 1, 30], [0, 0, 1, 30]];
    const opList = makeOpList([OPS.constructPath, OPS.fill], [rectPath, null]);
    const { h, v } = extractRules(opList, viewport);
    expect(v).toEqual([{ x0: 0, y0: 0, x1: 1, y1: 30 }]);
    expect(h).toEqual([]);
  });

  it("does not classify a large filled rect (both dimensions long) as a rule", () => {
    const rectPath: [number[], number[], number[]] = [
      [OPS.rectangle],
      [0, 0, 300, 400],
      [0, 0, 300, 400],
    ];
    const opList = makeOpList([OPS.constructPath, OPS.fill], [rectPath, null]);
    const { h, v } = extractRules(opList, viewport);
    expect(h).toEqual([]);
    expect(v).toEqual([]);
  });

  it("ignores a malformed constructPath args shape instead of throwing (defensive, complements the shape-guard test)", () => {
    const opList = makeOpList([OPS.constructPath], [{ not: "the expected tuple" }]);
    expect(() => extractRules(opList, viewport)).not.toThrow();
    expect(extractRules(opList, viewport)).toEqual({ h: [], v: [] });
  });
});
