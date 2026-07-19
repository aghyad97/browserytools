import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
// Node test env needs the legacy pdf.js entry (the browser build assumes a
// DOM canvas/worker environment). This file only ever runs the extraction
// path — getTextContent() — never render(), so no canvas polyfill is needed.
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { toSegments, type Segment } from "@/lib/pdf/layout/segments";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
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

async function segmentsForPage(
  fixture: string,
  pageNumber = 1,
): Promise<{ segments: Segment[]; viewport: { width: number; height: number } }> {
  const data = loadFixtureBytes(fixture);
  const doc = await getDocument({ data: new Uint8Array(data) }).promise;
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const textContent = await page.getTextContent();
  const segments = toSegments(textContent.items as TextItem[], viewport);
  await doc.destroy();
  return { segments, viewport };
}

describe("toSegments", () => {
  it("extracts a 'Region' segment from doc3-tables.pdf with fontSize ~12 and finite in-bounds geometry", async () => {
    const { segments, viewport } = await segmentsForPage("doc3-tables.pdf");
    const region = segments.find((s) => s.text.includes("Region"));
    expect(region).toBeDefined();
    expect(region!.fontSize).toBeGreaterThan(11.5);
    expect(region!.fontSize).toBeLessThan(12.5);
    expect(Number.isFinite(region!.x)).toBe(true);
    expect(Number.isFinite(region!.y)).toBe(true);
    expect(region!.x).toBeGreaterThanOrEqual(0);
    expect(region!.x).toBeLessThanOrEqual(viewport.width);
    expect(region!.y).toBeGreaterThanOrEqual(0);
    expect(region!.y).toBeLessThanOrEqual(viewport.height);
  });

  it("never merges across the column gutter on doc2-twocol.pdf (column-bleed guard)", async () => {
    const { segments } = await segmentsForPage("doc2-twocol.pdf");
    const bleeding = segments.filter(
      (s) => s.text.includes("ALPHA-START") && s.text.includes("BETA-START"),
    );
    expect(bleeding).toHaveLength(0);
    // Sanity: both markers actually appear somewhere in the extracted text,
    // so the assertion above isn't vacuously true because nothing matched.
    const allText = segments.map((s) => s.text).join(" ");
    expect(allText).toContain("ALPHA-START");
    expect(allText).toContain("BETA-START");
  });

  it("keeps doc6-twotables.pdf's header cells apart despite an 18.7pt column gap", async () => {
    // Regression: the merge cap used to be a fixed 20pt, so this table's
    // 18.75pt header gap merged "Region" and "Units" into ONE segment before
    // tables.ts ever ran — the header row vanished with no error anywhere.
    // The cap is now font-size-derived (0.75em => 9pt at this 12pt font), so
    // the two header cells survive as separate segments.
    //
    // NOTE: doc6's TABLE DETECTION is still wrong (two ruled tables on one
    // page merge into a single page-wide grid — a documented limitation, see
    // the PdfToWord honesty panel). This asserts only the segmentation fix.
    const { segments } = await segmentsForPage("doc6-twotables.pdf");
    const region = segments.filter((s) => s.text.trim() === "Region");
    const units = segments.filter((s) => s.text.trim() === "Units");
    expect(region).toHaveLength(1);
    expect(units).toHaveLength(1);
    // And nothing merged them into a single combined segment.
    expect(
      segments.filter((s) => s.text.includes("Region") && s.text.includes("Units")),
    ).toHaveLength(0);
  });

  it("flags at least one rtl segment on doc4-arabic.pdf", async () => {
    const { segments } = await segmentsForPage("doc4-arabic.pdf");
    expect(segments.some((s) => s.dir === "rtl")).toBe(true);
  });

  it("returns no segments for the image-only doc1-simple-scanned.pdf (no text layer)", async () => {
    const { segments } = await segmentsForPage("doc1-simple-scanned.pdf");
    expect(segments).toHaveLength(0);
  });

  it("extracts correctly-spaced prose from doc1-simple.pdf (integration, real fixture)", async () => {
    const { segments } = await segmentsForPage("doc1-simple.pdf");
    const allText = segments.map((s) => s.text).join(" ");
    expect(allText).toContain("Quarterly Operations Report");
    expect(allText).toContain("logistics division");
    // No two-letter concatenation artifact (lowercase immediately followed by
    // uppercase with no space) anywhere a word boundary should have been.
    expect(allText).not.toMatch(/[a-z][A-Z]/);
  });

  // Synthetic TextItem factory: real producers commonly decompose prose into
  // one TextItem per word plus whitespace-only TextItems between them (unlike
  // Chrome print-to-PDF, which happens to bake whole lines — including spaces
  // — into a single TextItem). toSegments must reconstruct the missing space
  // from geometry once the whitespace-only items are dropped.
  function makeItem(
    str: string,
    x: number,
    y: number,
    width: number,
    fontSize = 12,
  ): TextItem {
    return {
      str,
      dir: "ltr",
      transform: [fontSize, 0, 0, fontSize, x, y],
      width,
      height: fontSize,
      fontName: "F1",
      hasEOL: false,
    } as TextItem;
  }

  it("reconstructs word spacing when per-word TextItems are merged (pure toSegments, synthetic)", () => {
    // "Hello brave world" as three word TextItems + whitespace-only items in
    // between, with realistic ~3pt inter-word gaps (well under the merge cap
    // of 0.75 * 12pt = 9pt, so they merge) and matching per-word widths.
    const items: TextItem[] = [
      makeItem("Hello", 100, 500, 30),
      makeItem(" ", 130, 500, 3),
      makeItem("brave", 133, 500, 30),
      makeItem(" ", 163, 500, 3),
      makeItem("world", 166, 500, 30),
    ];
    const viewport = { width: 612, height: 792 } as PageViewport;
    const segments = toSegments(items, viewport);
    expect(segments).toHaveLength(1);
    expect(segments[0].text).toBe("Hello brave world");
    expect(segments[0].text).not.toBe("Hellobraveworld");
  });

  it("does not insert a space for an intra-word (kerning) split (pure toSegments, synthetic)", () => {
    // "Wor" + "ld" split mid-word with a near-zero gap, as a font kerning or
    // ligature boundary might produce.
    const items: TextItem[] = [
      makeItem("Wor", 100, 500, 21),
      makeItem("ld", 121.1, 500, 14),
    ];
    const viewport = { width: 612, height: 792 } as PageViewport;
    const segments = toSegments(items, viewport);
    expect(segments).toHaveLength(1);
    expect(segments[0].text).toBe("World");
  });
});
