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

  /**
   * Build a 4-row x 3-col borderless grid whose HEADER row is offset right by
   * `offset` pt — the bold-glyph-bearing shift colTol exists to absorb.
   */
  function headerOffsetGrid(fs: number, offset: number, leading: number): Segment[] {
    const cols = [100, 200, 300];
    const out: Segment[] = [];
    cols.forEach((c, i) => out.push(seg(`Header ${i}`, c + offset, 700, 40, fs)));
    for (let r = 0; r < 3; r++) {
      cols.forEach((c, i) => out.push(seg(`r${r}c${i}`, c, 700 - leading * (r + 1), 20, fs)));
    }
    return out;
  }

  const HEADER_GRID_ROWS = [
    ["Header 0", "Header 1", "Header 2"],
    ["r0c0", "r0c1", "r0c2"],
    ["r1c0", "r1c1", "r1c2"],
    ["r2c0", "r2c1", "r2c2"],
  ];

  // THE colTol GUARD, pinned on BOTH terms of Math.max(3, 0.3 * fontSize).
  // A fixed sub-3pt tolerance silently DROPS the header row (a bold header's
  // glyph bearings shift its left edge ~2pt relative to the data rows below,
  // so the run starts one row late and the table comes back headerless with no
  // error anywhere). Each case below is chosen so that exactly ONE term of the
  // max can carry it — delete the other term and the corresponding test fails.

  it("keeps a 2.7pt-offset header at fontSize 8 — pinned by the 3pt FLOOR", () => {
    // 0.3 * 8 = 2.4 < 2.7 <= 3, so the ratio term alone REJECTS this row and
    // only the floor admits it. (The old version of this test used a 2.1pt
    // offset, which 2.4 already covers — it did not pin the floor at all.)
    const table = detectBorderlessTable(headerOffsetGrid(8, 2.7, 15));
    expect(table).not.toBeNull();
    expect(table?.rows).toEqual(HEADER_GRID_ROWS);
  });

  it("keeps an 8pt-offset header at fontSize 30 — pinned by the 0.3x RATIO term", () => {
    // 0.3 * 30 = 9 > 8, so the ratio term admits this row while a bare 3pt
    // floor would reject it. Large display type really does shift this much.
    const table = detectBorderlessTable(headerOffsetGrid(30, 8, 45));
    expect(table).not.toBeNull();
    expect(table?.rows).toEqual(HEADER_GRID_ROWS);
  });

  it("groups rows against the seed span, so tight leading does not chain-merge", () => {
    // groupRows must test each segment against the ROW'S SEED span, not the
    // union of everything admitted so far. With a growing union, three 12pt
    // lines at 10pt leading (700-712, 690-702, 680-692) each overlap the
    // previous union and collapse into ONE pseudo-row of 9 segments; rowsAlign
    // then fails the count check and this legitimate table returns null.
    const cols = [100, 200, 300];
    const rows: Segment[] = [];
    for (let r = 0; r < 4; r++) {
      cols.forEach((c, i) => rows.push(seg(`r${r}c${i}`, c, 700 - 10 * r, 20, 12)));
    }
    const table = detectBorderlessTable(rows);
    expect(table).not.toBeNull();
    expect(table?.rows).toHaveLength(4);
    expect(table?.rows[0]).toEqual(["r0c0", "r0c1", "r0c2"]);
    expect(table?.rows[3]).toEqual(["r3c0", "r3c1", "r3c2"]);
  });

  it("orders an RTL table's columns right-to-left (logical reading order)", () => {
    // Segment.dir is not decoration: in an RTL table the leftmost column is
    // the LAST column logically, so sorting by ascending x reverses the table.
    const rows: Segment[] = [];
    for (let r = 0; r < 3; r++) {
      // c0 is the RIGHTMOST (x = 300) — first in logical order.
      [300, 200, 100].forEach((x, i) => {
        rows.push({ ...seg(`r${r}c${i}`, x, 700 - 20 * r, 20, 12), dir: "rtl" });
      });
    }
    const table = detectBorderlessTable(rows);
    expect(table).not.toBeNull();
    expect(table?.rows).toEqual([
      ["r0c0", "r0c1", "r0c2"],
      ["r1c0", "r1c1", "r1c2"],
      ["r2c0", "r2c1", "r2c2"],
    ]);
  });

  it("reports the exact segments it consumed, for identity-based exclusion", () => {
    // Downstream excludes table text from paragraph flow by identity against
    // this array — never by re-deriving a geometric test from `box`.
    const grid = headerOffsetGrid(8, 2.7, 15);
    const table = detectBorderlessTable(grid);
    expect(table?.segments).toHaveLength(12);
    for (const s of table?.segments ?? []) expect(grid).toContain(s);
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
    // The clustering collapses these to 2 h-boundaries and 2 v-boundaries —
    // i.e. a single 1x1 cell, which is a bordered CALLOUT, not a table (see
    // the next test). Asserting null here is what proves the clustering ran:
    // unclustered, this input would be a 3x2 grid and come back as a table.
    const table = detectRuledTable({ h, v }, [seg("only", 60, 140, 30)], pageBox);
    expect(table).toBeNull();
  });

  it("returns null for a single closed rectangle (a bordered callout is not a table)", () => {
    // 2 h-rules + 2 v-rules is the minimum-viable grid by rule COUNT, but it
    // is exactly ONE cell. Bordered pull-quotes, framed code blocks, image
    // frames and signature boxes are common in real documents and all produce
    // precisely this shape; treating them as 1x1 tables would pull their text
    // out of normal paragraph flow. Require >= 2 cells on some axis.
    const pageBox = { x0: 0, y0: 0, x1: 612, y1: 792 };
    const h: Line[] = [
      { x0: 50, y0: 200, x1: 350, y1: 200 },
      { x0: 50, y0: 100, x1: 350, y1: 100 },
    ];
    const v: Line[] = [
      { x0: 50, y0: 100, x1: 50, y1: 200 },
      { x0: 350, y0: 100, x1: 350, y1: 200 },
    ];
    const inside = [seg("A pull quote.", 60, 140, 200)];
    expect(detectRuledTable({ h, v }, inside, pageBox)).toBeNull();

    // One more rule on either axis makes it a real 1x2 grid, and it detects.
    const withRow = [...h, { x0: 50, y0: 150, x1: 350, y1: 150 }];
    expect(detectRuledTable({ h: withRow, v }, inside, pageBox)).not.toBeNull();
  });

  it("reports the exact segments it consumed, for identity-based exclusion", () => {
    // `box` is unsafe for exclusion (it is built from rule CENTRES, and for a
    // table with no outer border it spans only the inner rules), so the table
    // records the Segment identities it actually placed into cells.
    const pageBox = { x0: 0, y0: 0, x1: 612, y1: 792 };
    const h: Line[] = [
      { x0: 50, y0: 200, x1: 350, y1: 200 },
      { x0: 50, y0: 150, x1: 350, y1: 150 },
      { x0: 50, y0: 100, x1: 350, y1: 100 },
    ];
    const v: Line[] = [
      { x0: 50, y0: 100, x1: 50, y1: 200 },
      { x0: 200, y0: 100, x1: 200, y1: 200 },
    ];
    const inGrid = [seg("A", 60, 175, 20), seg("B", 60, 125, 20)];
    const outside = seg("prose below the table", 60, 60, 200);
    const table = detectRuledTable({ h, v }, [...inGrid, outside], pageBox);
    expect(table?.segments).toEqual(inGrid);
    expect(table?.segments).not.toContain(outside);
  });
});
