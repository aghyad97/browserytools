import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
// Node test env needs the legacy pdf.js entry (the browser build assumes a
// DOM canvas/worker environment). This file only ever runs the extraction
// path — getTextContent() — never render(), so no canvas polyfill is needed.
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { toSegments, type Segment } from "@/lib/pdf/layout/segments";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

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

  it("flags at least one rtl segment on doc4-arabic.pdf", async () => {
    const { segments } = await segmentsForPage("doc4-arabic.pdf");
    expect(segments.some((s) => s.dir === "rtl")).toBe(true);
  });

  it("returns no segments for the image-only doc1-simple-scanned.pdf (no text layer)", async () => {
    const { segments } = await segmentsForPage("doc1-simple-scanned.pdf");
    expect(segments).toHaveLength(0);
  });
});
