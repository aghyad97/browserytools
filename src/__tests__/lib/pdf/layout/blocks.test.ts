import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
// Node test env needs the legacy pdf.js entry (the browser build assumes a
// DOM canvas/worker environment). Same pattern as tables.test.ts /
// reading-order.test.ts — getTextContent()/getOperatorList() only, never render().
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { toSegments, type Segment } from "@/lib/pdf/layout/segments";
import { extractRules, type Line } from "@/lib/pdf/layout/rules";
import { orderSegments } from "@/lib/pdf/layout/reading-order";
import { detectRuledTable, detectBorderlessTable, type DetectedTable } from "@/lib/pdf/layout/tables";
import { classify, type DocBlock } from "@/lib/pdf/layout/blocks";

const FIXTURES_DIR = path.join(process.cwd(), "src/__tests__/fixtures/pdf");

interface PageGeometry {
  segments: Segment[];
  rules: { h: Line[]; v: Line[] };
  pageBox: { x0: number; y0: number; x1: number; y1: number };
}

async function pageGeometry(fixture: string, pageNumber = 1): Promise<PageGeometry> {
  // getDocument() DETACHES the buffer it is handed (it transfers the
  // underlying ArrayBuffer to the worker). Passing a COPY is mandatory —
  // reusing the original view after this call reads as a zeroed buffer.
  const buf = readFileSync(path.join(FIXTURES_DIR, fixture));
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
function seg(text: string, x: number, y: number, w: number, fontSize = 12, dir: "ltr" | "rtl" = "ltr"): Segment {
  return { text, x, y, w, h: fontSize, fontSize, fontName: "F1", dir };
}

function textOf(block: DocBlock): string {
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "table") return block.rows.flat().join(" ");
  return block.text;
}

describe("classify — doc1-simple.pdf (headings, paragraphs, list, zero false positives)", () => {
  it("emits exactly one h1, two h2s, one 3-item list, and only paragraph/list otherwise", async () => {
    const { segments, pageBox } = await pageGeometry("doc1-simple.pdf");
    const regions = orderSegments(segments, pageBox);
    const blocks = classify(regions, []);

    const h1 = blocks.filter((b) => b.type === "heading" && b.level === 1);
    expect(h1).toHaveLength(1);
    expect((h1[0] as Extract<DocBlock, { type: "heading" }>).text).toBe(
      "Quarterly Operations Report",
    );

    const h2 = blocks.filter((b) => b.type === "heading" && b.level === 2);
    expect(h2).toHaveLength(2);
    expect(h2.map((b) => (b as Extract<DocBlock, { type: "heading" }>).text)).toEqual([
      "Key Developments",
      "Outlook",
    ]);

    const lists = blocks.filter((b) => b.type === "list");
    expect(lists).toHaveLength(1);
    const list = lists[0] as Extract<DocBlock, { type: "list" }>;
    expect(list.items).toHaveLength(3);

    // Zero false-positive headings: every block that isn't one of the three
    // known headings must be a paragraph or the list.
    for (const b of blocks) {
      if (b.type === "heading") continue;
      expect(["paragraph", "list"]).toContain(b.type);
    }
  });
});

describe("classify — doc3-tables.pdf (identity-exclusion guard)", () => {
  it("emits 2 table blocks, and no non-table block contains any table cell text", async () => {
    const { rules, segments, pageBox } = await pageGeometry("doc3-tables.pdf");
    const regions = orderSegments(segments, pageBox);

    const ruled = detectRuledTable(rules, segments, pageBox);
    expect(ruled).not.toBeNull();

    // Per detectBorderlessTable's per-region contract, isolate the borderless
    // table's region by taking everything below its heading — same pattern
    // as tables.test.ts (doc3 has no gutter, so orderSegments does not
    // separate the two tables on its own).
    const heading = segments.find((s) => s.text === "Borderless table");
    expect(heading).toBeDefined();
    const borderlessRegion = segments.filter((s) => s.y < (heading?.y ?? 0));
    const borderless = detectBorderlessTable(borderlessRegion);
    expect(borderless).not.toBeNull();

    const tables = [ruled, borderless].filter((t): t is DetectedTable => t !== null);
    const blocks = classify(regions, tables);

    const tableBlocks = blocks.filter((b) => b.type === "table");
    expect(tableBlocks).toHaveLength(2);

    // The single most important test in this module: table cell text must
    // NEVER leak into a paragraph/heading/list block.
    const forbidden = ["48200", "Widget A", "36150"];
    for (const b of blocks) {
      if (b.type === "table") continue;
      const text = textOf(b);
      for (const f of forbidden) {
        expect(text, `"${f}" leaked into a ${b.type} block: "${text}"`).not.toContain(f);
      }
    }
  });
});

describe("classify — doc2-twocol.pdf (multi-region heading merge)", () => {
  it("emits the two-line title as ONE heading block, not two", async () => {
    const { segments, pageBox } = await pageGeometry("doc2-twocol.pdf");
    const regions = orderSegments(segments, pageBox);
    const blocks = classify(regions, []);

    const headings = blocks.filter((b): b is Extract<DocBlock, { type: "heading" }> =>
      b.type === "heading",
    );
    const titleHeadings = headings.filter((h) => h.text.includes("On the Recovery of Reading Order"));
    expect(titleHeadings).toHaveLength(1);
    // The merged block must carry the continuation line too.
    expect(titleHeadings[0].text).toContain("Layout Documents");

    // No OTHER heading block holds the remainder of the title on its own.
    const strayRemainder = headings.filter(
      (h) => h.text.includes("Layout Documents") && !h.text.includes("On the Recovery of Reading Order"),
    );
    expect(strayRemainder).toHaveLength(0);
  });

  it("never merges two distinct paragraphs into one block across a column boundary", async () => {
    // Regression (found in real-browser verification): the .docx contained
    // "ALPHA-END BETA-START" inside a SINGLE <w:p>. The ALPHA paragraph ends
    // at the top of column B and the BETA paragraph starts below it — both
    // genuinely in the same reading-order region, so the region-boundary
    // guard alone could not catch it. classify() now also breaks a paragraph
    // on a vertical gap larger than normal line leading.
    const { segments, pageBox } = await pageGeometry("doc2-twocol.pdf");
    const regions = orderSegments(segments, pageBox);
    const blocks = classify(regions, []);

    const merged = blocks.filter(
      (b) => textOf(b).includes("ALPHA-END") && textOf(b).includes("BETA-START"),
    );
    expect(merged).toHaveLength(0);

    // Not vacuous: both markers must actually be present, in separate blocks,
    // and ALPHA-END must still precede BETA-START in document order.
    const alphaEnd = blocks.findIndex((b) => textOf(b).includes("ALPHA-END"));
    const betaStart = blocks.findIndex((b) => textOf(b).includes("BETA-START"));
    expect(alphaEnd).toBeGreaterThanOrEqual(0);
    expect(betaStart).toBeGreaterThanOrEqual(0);
    expect(alphaEnd).toBeLessThan(betaStart);
  });

  it("keeps a paragraph's own wrapped lines together (paragraph break is not per-line)", async () => {
    // Guard against over-breaking: the vertical-gap rule must not split every
    // line into its own paragraph. doc2's opening paragraph wraps over four
    // lines and must stay a single block.
    const { segments, pageBox } = await pageGeometry("doc2-twocol.pdf");
    const regions = orderSegments(segments, pageBox);
    const blocks = classify(regions, []);

    const opening = blocks.filter((b) => textOf(b).includes("ALPHA-START"));
    expect(opening).toHaveLength(1);
    expect(textOf(opening[0])).toContain("visual fidelity");
    expect(textOf(opening[0])).toContain("than a narrative order.");
  });
});

describe("classify — doc4-arabic.pdf (rtl propagation)", () => {
  it("marks every block rtl: true on an all-Arabic page", async () => {
    const { segments, pageBox } = await pageGeometry("doc4-arabic.pdf");
    const regions = orderSegments(segments, pageBox);
    const blocks = classify(regions, []);

    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(b.type).not.toBe("table");
      expect((b as { rtl?: boolean }).rtl).toBe(true);
    }
  });
});

describe("classify — identity-based exclusion (synthetic)", () => {
  it("excludes table text ONLY when the DetectedTable references the exact Segment objects", () => {
    const tableSeg1 = seg("TABLECELL1", 60, 700, 80, 12);
    const tableSeg2 = seg("TABLECELL2", 60, 685, 80, 12);
    const paragraphSeg = seg("Some ordinary prose text.", 60, 660, 200, 12);
    const region = [tableSeg1, tableSeg2, paragraphSeg];

    const table: DetectedTable = {
      rows: [["TABLECELL1"], ["TABLECELL2"]],
      ruled: true,
      box: { x0: 60, y0: 685, x1: 140, y1: 712 },
      segments: [tableSeg1, tableSeg2], // exact references
    };

    const blocksWithRealRefs = classify([region], [table]);
    for (const b of blocksWithRealRefs) {
      if (b.type === "table") continue;
      const text = textOf(b);
      expect(text).not.toContain("TABLECELL1");
      expect(text).not.toContain("TABLECELL2");
    }
    // The table itself is still emitted.
    expect(blocksWithRealRefs.some((b) => b.type === "table")).toBe(true);

    // ---- Variant: structurally-equal CLONES, not the same references. ----
    // This documents that identity — not value — is what's required. Cloning
    // a Segment ({...seg}) is exactly the mistake the binding constraint
    // warns against: the exclusion Set is built from the clones, so it never
    // matches the ORIGINAL objects still sitting in `region`, and the table
    // text leaks straight into paragraph flow. This is EXPECTED behavior
    // given the identity-only contract, not a bug in classify() — the test
    // exists to prove the contract is load-bearing, not accidental.
    const clonedTable: DetectedTable = {
      ...table,
      segments: table.segments.map((s) => ({ ...s })),
    };
    const blocksWithClones = classify([region], [clonedTable]);
    const leaked = blocksWithClones
      .filter((b) => b.type !== "table")
      .map((b) => textOf(b))
      .join(" | ");
    expect(leaked).toContain("TABLECELL1");
    expect(leaked).toContain("TABLECELL2");
  });
});

describe("classify — list detection (synthetic)", () => {
  it("groups a bulleted list into one unordered list block with markers stripped", () => {
    const region = [
      seg("• First item", 70, 700, 100, 12),
      seg("• Second item", 70, 685, 100, 12),
      seg("• Third item", 70, 670, 100, 12),
    ];
    const blocks = classify([region], []);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      type: "list",
      ordered: false,
      items: ["First item", "Second item", "Third item"],
    });
  });

  it("groups a numbered list into one ordered list block with markers stripped", () => {
    const region = [
      seg("1. First item", 70, 700, 100, 12),
      seg("2. Second item", 70, 685, 100, 12),
      seg("3. Third item", 70, 670, 100, 12),
    ];
    const blocks = classify([region], []);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      type: "list",
      ordered: true,
      items: ["First item", "Second item", "Third item"],
    });
  });

  it("still emits a genuine 2-item MARKED list as a list (marker minimum unchanged)", () => {
    const region = [seg("• Alpha item", 70, 700, 120, 12), seg("• Beta item", 70, 685, 120, 12)];
    const blocks = classify([region], []);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      type: "list",
      ordered: false,
      items: ["Alpha item", "Beta item"],
    });
  });

  it("does NOT emit a 2-line INDENT-ONLY run (no markers) as a list — e.g. a wrapped block quote", () => {
    // Three body-margin lines establish bodyIndent = 60, then two consistently
    // indented lines with no marker follow — the shape a wrapped block quote
    // produces just as well as a real list. With MIN_INDENT_ONLY_LIST_RUN = 3
    // a run of only 2 must be demoted to paragraph text, not emitted as a list.
    const region = [
      seg("Body line one establishing margin alpha", 60, 760, 260, 12),
      seg("Body line two establishing margin beta", 60, 745, 260, 12),
      seg("Body line three establishing margin gamma", 60, 730, 260, 12),
      seg("Indented quotation line one", 80, 715, 200, 12),
      seg("Indented quotation line two", 80, 700, 200, 12),
    ];
    const blocks = classify([region], []);
    expect(blocks.some((b) => b.type === "list")).toBe(false);
    const allText = blocks.map(textOf).join(" | ");
    // Neither demoted line was silently dropped.
    expect(allText).toContain("Indented quotation line one");
    expect(allText).toContain("Indented quotation line two");
  });
});

describe("classify — list demotion is region-safe (regression for cross-region splice bug)", () => {
  it("does not splice a lone indented line from one region onto the previous region's paragraph", () => {
    // Region 0: an ordinary two-line paragraph at the body margin (x=60).
    // Region 1: starts with a LONE indented line (x=90, no marker — a
    // caption/footnote/quote-opener shape), followed by a normal-margin
    // line that breaks the indent run. The lone line is too weak a signal
    // to be a list on its own (group length 1 < MIN_INDENT_ONLY_LIST_RUN)
    // and must be demoted — but demotion must still respect the region
    // boundary instead of appending straight onto region 0's paragraph.
    const a1 = seg("First region opening line one", 60, 700, 220, 12);
    const a2 = seg("First region closing line two", 60, 685, 220, 12);
    const b1 = seg("Lone indented caption line", 90, 700, 200, 12);
    const b2 = seg("Second region body line", 60, 685, 200, 12);

    const blocks = classify([[a1, a2], [b1, b2]], []);

    expect(blocks.every((b) => b.type !== "list")).toBe(true);

    const texts = blocks.map(textOf);
    const crossContaminated = texts.some(
      (t) => t.includes("First region") && t.includes("Lone indented caption"),
    );
    expect(crossContaminated).toBe(false);

    // Nothing was silently dropped either.
    const allText = texts.join(" | ");
    expect(allText).toContain("First region opening line one");
    expect(allText).toContain("First region closing line two");
    expect(allText).toContain("Lone indented caption line");
    expect(allText).toContain("Second region body line");
  });
});

describe("classify — heading merge does not join two distinct headings (regression)", () => {
  it("emits TWO heading blocks for same-size headings separated by a normal (non-continuation) gap", () => {
    // Mimics an empty first CV section: "Skills" immediately followed by
    // "Experience" with nothing between them. Both are 20pt heading-sized
    // lines with a 40pt gap — well above HEADING_MERGE_GAP_RATIO (1.6) * 20
    // = 32pt, so they must NOT merge into "Skills Experience".
    const region = [
      seg("Skills", 60, 800, 60, 20),
      seg("Experience", 60, 760, 100, 20),
      seg("This is a plain body sentence with several words to anchor body size.", 60, 700, 300, 12),
      seg(
        "Another plain body sentence used only to establish the body font size baseline.",
        60,
        685,
        320,
        12,
      ),
    ];
    const blocks = classify([region], []);
    const headings = blocks.filter((b): b is Extract<DocBlock, { type: "heading" }> => b.type === "heading");
    expect(headings).toHaveLength(2);
    expect(headings.map((h) => h.text)).toEqual(["Skills", "Experience"]);
  });

  it("still merges doc2-twocol.pdf's genuine two-line title into ONE heading block (no regression)", async () => {
    const { segments, pageBox } = await pageGeometry("doc2-twocol.pdf");
    const regions = orderSegments(segments, pageBox);
    const blocks = classify(regions, []);
    const headings = blocks.filter((b): b is Extract<DocBlock, { type: "heading" }> => b.type === "heading");
    const titleHeadings = headings.filter((h) => h.text.includes("On the Recovery of Reading Order"));
    expect(titleHeadings).toHaveLength(1);
    expect(titleHeadings[0].text).toContain("Layout Documents");
  });
});
