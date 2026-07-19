import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
// Node test env needs the legacy pdf.js entry (the browser build assumes a
// DOM canvas/worker environment). Same pattern as rules.test.ts /
// segments.test.ts — getTextContent()/getOperatorList() only, never render().
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { toSegments, type Segment } from "@/lib/pdf/layout/segments";
import { extractRules, type Line } from "@/lib/pdf/layout/rules";
import { orderSegments } from "@/lib/pdf/layout/reading-order";
import { detectRuledTable, detectBorderlessTable } from "@/lib/pdf/layout/tables";

const FIXTURES_DIR = path.join(process.cwd(), "src/__tests__/fixtures/pdf");

interface PageGeometry {
  segments: Segment[];
  rules: { h: Line[]; v: Line[] };
  pageBox: { x0: number; y0: number; x1: number; y1: number };
}

async function pageGeometry(fixture: string, pageNumber = 1): Promise<PageGeometry> {
  const buf = readFileSync(path.join(FIXTURES_DIR, fixture));
  // getDocument() DETACHES the buffer it is handed (it transfers the
  // underlying ArrayBuffer to the worker). Passing a COPY is mandatory —
  // reusing the original view after this call reads as a zeroed buffer.
  const doc = await getDocument({ data: new Uint8Array(buf) }).promise;
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const textContent = await page.getTextContent();
  const segments = toSegments(textContent.items as TextItem[], viewport);
  const opList = await page.getOperatorList();
  const rules = extractRules(opList, viewport);
  await doc.destroy();
  return {
    segments,
    rules,
    pageBox: { x0: 0, y0: 0, x1: viewport.width, y1: viewport.height },
  };
}

/** A minimal synthetic segment; only geometry and text matter to this module. */
function seg(text: string, x: number, y: number, w: number, fontSize = 12): Segment {
  return { text, x, y, w, h: fontSize, fontSize, fontName: "F1", dir: "ltr" };
}

const RULED_GROUND_TRUTH = [
  ["Region", "Units", "Revenue"],
  ["North", "1240", "48200"],
  ["South", "980", "36150"],
  ["East", "1515", "59870"],
];

const BORDERLESS_GROUND_TRUTH = [
  ["Product", "Stock", "Reorder"],
  ["Widget A", "320", "100"],
  ["Widget B", "85", "150"],
  ["Widget C", "640", "200"],
];

const STROKED_GROUND_TRUTH = [
  ["Region", "Units", "Revenue"],
  ["North", "1240", "48200"],
  ["South", "980", "36150"],
];

describe("detectRuledTable — real fixtures", () => {
  it("reconstructs the full 3x4 ruled grid on doc3-tables.pdf (12/12 cells)", async () => {
    // doc3 is Chrome print-to-PDF output: the borders arrive as one filled
    // rect PER CELL EDGE, not per logical grid line (h=15, v=16 raw for a
    // logical 5h x 4v grid), so this only passes if near-collinear rules are
    // clustered into logical lines before the grid is built.
    const { rules, segments, pageBox } = await pageGeometry("doc3-tables.pdf");
    const table = detectRuledTable(rules, segments, pageBox);
    expect(table).not.toBeNull();
    expect(table?.ruled).toBe(true);
    expect(table?.rows).toEqual(RULED_GROUND_TRUTH);
  });

  it("reconstructs the 3x3 stroked grid on stroked-rules.pdf (9/9 cells)", async () => {
    // The LaTeX/Word idiom (moveTo/lineTo/stroke) end-to-end through table
    // reconstruction, not just through rule extraction.
    const { rules, segments, pageBox } = await pageGeometry("stroked-rules.pdf");
    const table = detectRuledTable(rules, segments, pageBox);
    expect(table).not.toBeNull();
    expect(table?.rows).toEqual(STROKED_GROUND_TRUTH);
  });

  it("returns null on doc1-simple.pdf (prose, no ruled table)", async () => {
    const { rules, segments, pageBox } = await pageGeometry("doc1-simple.pdf");
    expect(detectRuledTable(rules, segments, pageBox)).toBeNull();
  });
});

describe("detectBorderlessTable — real fixture", () => {
  it("reconstructs the full 3x4 borderless grid on doc3-tables.pdf (12/12 cells)", async () => {
    const { segments } = await pageGeometry("doc3-tables.pdf");
    // Per the module contract, detectBorderlessTable is fed a single region.
    // orderSegments returns doc3 as ONE region (it has no gutter), so the
    // borderless block is isolated here by taking everything below its
    // heading — standing in for the per-region slicing Task 6 will do.
    const heading = segments.find((s) => s.text === "Borderless table");
    expect(heading).toBeDefined();
    const region = segments.filter((s) => s.y < (heading?.y ?? 0));
    expect(region).toHaveLength(12);

    const table = detectBorderlessTable(region);
    expect(table).not.toBeNull();
    expect(table?.ruled).toBe(false);
    expect(table?.rows).toEqual(BORDERLESS_GROUND_TRUTH);
  });

  it("includes a header row whose left edge is offset ~2.1pt by bold glyph bearings", () => {
    // THE colTol GUARD. colTol must be Math.max(3, 0.3 * fontSize) — a fixed
    // tolerance below 3pt silently DROPS the header row, because a bold
    // header's glyph bearings shift its left edge ~2.1pt relative to the
    // data rows. At fontSize 8, 0.3 * fontSize = 2.4 < 2.1 would fail, so
    // the floor of 3 is what carries this case.
    const fs = 8;
    const cols = [100, 200, 300];
    const rows: Segment[] = [
      seg("Header A", cols[0] + 2.1, 700, 40, fs),
      seg("Header B", cols[1] + 2.1, 700, 40, fs),
      seg("Header C", cols[2] + 2.1, 700, 40, fs),
      seg("a1", cols[0], 685, 20, fs),
      seg("b1", cols[1], 685, 20, fs),
      seg("c1", cols[2], 685, 20, fs),
      seg("a2", cols[0], 670, 20, fs),
      seg("b2", cols[1], 670, 20, fs),
      seg("c2", cols[2], 670, 20, fs),
      seg("a3", cols[0], 655, 20, fs),
      seg("b3", cols[1], 655, 20, fs),
      seg("c3", cols[2], 655, 20, fs),
    ];
    const table = detectBorderlessTable(rows);
    expect(table).not.toBeNull();
    expect(table?.rows).toEqual([
      ["Header A", "Header B", "Header C"],
      ["a1", "b1", "c1"],
      ["a2", "b2", "c2"],
      ["a3", "b3", "c3"],
    ]);
  });
});

describe("detectBorderlessTable — the per-region contract (false-positive guard)", () => {
  it("returns null for every column region of doc2-twocol.pdf, but DOES fire page-wide", async () => {
    // This is the load-bearing test of the whole module. Two-column prose IS
    // geometrically an aligned grid: every left-column line pairs with a
    // right-column line at a similar baseline, and both columns' left edges
    // are perfectly constant. Fed page-wide, that reads as a table. The fix
    // is architectural — call this per reading-order column region, where a
    // prose line is the region's only segment on its row and the >= 2
    // segments-per-row bar removes it. A content heuristic (fill ratio) was
    // measured and FAILED to separate these cases; do not reintroduce one.
    const { segments, pageBox } = await pageGeometry("doc2-twocol.pdf");
    const regions = orderSegments(segments, pageBox);
    expect(regions.length).toBeGreaterThanOrEqual(2);

    // Direction 1: per region — zero false positives.
    for (const region of regions) {
      expect(detectBorderlessTable(region)).toBeNull();
    }

    // Direction 2: page-wide — the false positive the contract exists to
    // avoid. If this ever stops firing, the guard above has gone vacuous.
    const pageWide = detectBorderlessTable(segments);
    expect(pageWide).not.toBeNull();
    expect(pageWide?.rows.length).toBeGreaterThanOrEqual(3);
  });
});

describe("detectRuledTable — defensive bounds checking", () => {
  it("ignores an out-of-page rule and still reconstructs the valid grid", () => {
    // extractRules deliberately returns RAW, unfiltered coordinates (it does
    // no page-bounds filtering, so its own inverted-CTM regression test can
    // observe the garbage). A bad CTM produces coordinates like y = -1731;
    // unfiltered, that would add a phantom grid band spanning -1731..100 and
    // yield a 3-row table with an empty first row instead of a 2-row one.
    const pageBox = { x0: 0, y0: 0, x1: 612, y1: 792 };
    const h: Line[] = [
      { x0: 50, y0: 200, x1: 350, y1: 200 },
      { x0: 50, y0: 150, x1: 350, y1: 150 },
      { x0: 50, y0: 100, x1: 350, y1: 100 },
      { x0: 50, y0: -1731, x1: 350, y1: -1731 }, // garbage, out of page
    ];
    const v: Line[] = [
      { x0: 50, y0: 100, x1: 50, y1: 200 },
      { x0: 200, y0: 100, x1: 200, y1: 200 },
      { x0: 350, y0: 100, x1: 350, y1: 200 },
    ];
    const segments = [
      seg("A", 60, 175, 20),
      seg("B", 210, 175, 20),
      seg("C", 60, 125, 20),
      seg("D", 210, 125, 20),
    ];
    const table = detectRuledTable({ h, v }, segments, pageBox);
    expect(table).not.toBeNull();
    expect(table?.rows).toEqual([
      ["A", "B"],
      ["C", "D"],
    ]);
    expect(table?.box.y0).toBeCloseTo(100);
    expect(table?.box.y1).toBeCloseTo(200);
  });

  it("returns null when only one axis has enough rules (a stray clip rect is not a table)", () => {
    const pageBox = { x0: 0, y0: 0, x1: 612, y1: 792 };
    const h: Line[] = [
      { x0: 50, y0: 200, x1: 350, y1: 200 },
      { x0: 50, y0: 100, x1: 350, y1: 100 },
    ];
    const v: Line[] = [{ x0: 50, y0: 100, x1: 50, y1: 200 }];
    expect(detectRuledTable({ h, v }, [seg("A", 60, 175, 20)], pageBox)).toBeNull();
  });

  it("clusters near-collinear rules within 2pt into one logical grid line", () => {
    // Chrome emits one filled rect per CELL EDGE, so a logical line arrives
    // as several overlapping rules offset by well under a point. Duplicates
    // are expected input, not a defect.
    const pageBox = { x0: 0, y0: 0, x1: 612, y1: 792 };
    const h: Line[] = [
      { x0: 50, y0: 200, x1: 200, y1: 200.75 },
      { x0: 200, y0: 200.1, x1: 350, y1: 200.75 },
      { x0: 50, y0: 100, x1: 200, y1: 100.75 },
      { x0: 200, y0: 100.2, x1: 350, y1: 100.75 },
    ];
    const v: Line[] = [
      { x0: 50, y0: 100, x1: 50.75, y1: 200 },
      { x0: 50.1, y0: 100, x1: 50.75, y1: 150 },
      { x0: 349.25, y0: 100, x1: 350, y1: 200 },
    ];
    const table = detectRuledTable({ h, v }, [seg("only", 60, 140, 30)], pageBox);
    expect(table).not.toBeNull();
    expect(table?.rows).toEqual([["only"]]); // 1 row x 1 col, not 3x2
  });
});
