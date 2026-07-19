import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
// Node test env needs the legacy pdf.js entry (the browser build assumes a
// DOM canvas/worker environment). Extraction path only — no canvas needed.
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { toSegments, type Segment } from "@/lib/pdf/layout/segments";
import { orderSegments } from "@/lib/pdf/layout/reading-order";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

const FIXTURES_DIR = path.join(process.cwd(), "src/__tests__/fixtures/pdf");

async function orderedRegionsFor(
  fixture: string,
  pageNumber = 1,
): Promise<Segment[][]> {
  // getDocument() DETACHES the buffer it is handed. Always pass a copy.
  const buf = readFileSync(path.join(FIXTURES_DIR, fixture));
  const doc = await getDocument({ data: new Uint8Array(buf) }).promise;
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const textContent = await page.getTextContent();
  const segments = toSegments(textContent.items as TextItem[], viewport);
  await doc.destroy();
  return orderSegments(segments, {
    x0: 0,
    y0: 0,
    x1: viewport.width,
    y1: viewport.height,
  });
}

function joinRegions(regions: Segment[][]): string {
  return regions.map((r) => r.map((s) => s.text).join(" ")).join("\n");
}

describe("orderSegments", () => {
  it("recovers the FULL reading order of doc2-twocol.pdf, not just the markers", async () => {
    const regions = await orderedRegionsFor("doc2-twocol.pdf");
    const text = joinRegions(regions);

    // The seven probes must appear in strictly increasing order. This is the
    // assertion that catches the measured trap: a band-split-first algorithm
    // still emits ALPHA-*/BETA-* in the right sequence, but places "The
    // procedure terminates" (right column, high on the page) BEFORE "Method"
    // (left column, lower on the page). Marker-only assertions pass against
    // that broken output — the full sequence does not.
    const probes = [
      "ALPHA-START",
      "Method",
      "The procedure terminates",
      "ALPHA-END",
      "BETA-START",
      "Results",
      "BETA-END",
    ];
    const indices = probes.map((p) => text.indexOf(p));
    for (let i = 0; i < probes.length; i++) {
      expect(indices[i], `probe "${probes[i]}" missing from output`).toBeGreaterThanOrEqual(0);
    }
    for (let i = 1; i < probes.length; i++) {
      expect(
        indices[i],
        `"${probes[i]}" must come after "${probes[i - 1]}"`,
      ).toBeGreaterThan(indices[i - 1]);
    }

    // The full-width title crosses the gutter and must be emitted before any
    // column content (this is what the header peel exists for).
    const titleIndex = text.indexOf("On the Recovery of Reading Order");
    expect(titleIndex).toBeGreaterThanOrEqual(0);
    expect(titleIndex).toBeLessThan(Math.min(...indices));
  });

  it("keeps single-column doc1-simple.pdf as one region in document order", async () => {
    const regions = await orderedRegionsFor("doc1-simple.pdf");
    // No spurious column split: a one-column page is a single region.
    expect(regions).toHaveLength(1);
    expect(regions[0].length).toBeGreaterThan(1);

    const text = joinRegions(regions);
    const title = text.indexOf("Quarterly Operations Report");
    const keyDev = text.indexOf("Key Developments");
    const outlook = text.indexOf("Outlook");
    expect(title).toBeGreaterThanOrEqual(0);
    expect(keyDev).toBeGreaterThan(title);
    expect(outlook).toBeGreaterThan(keyDev);
  });

  it("orders the RTL lines of doc4-arabic.pdf top-to-bottom", async () => {
    const regions = await orderedRegionsFor("doc4-arabic.pdf");
    const flat = regions.flat();
    expect(flat.length).toBeGreaterThan(0);

    // Group the emitted order into visual lines by baseline proximity, then
    // assert those lines come out in descending-y order (PDF origin is
    // bottom-left, so descending y == top of page to bottom).
    const lineYs: number[] = [];
    for (const seg of flat) {
      const last = lineYs[lineYs.length - 1];
      if (last === undefined || Math.abs(last - seg.y) > 5) lineYs.push(seg.y);
    }
    expect(lineYs).toHaveLength(5);
    for (let i = 1; i < lineYs.length; i++) {
      expect(lineYs[i]).toBeLessThan(lineYs[i - 1]);
    }
  });

  it("peels a full-width title before splitting columns (pure unit, synthetic)", () => {
    // Synthetic page: one full-width title that crosses the gutter, plus two
    // 3-segment columns. At k=0 the title blocks the gutter, so the gutter
    // search must retry with the top segment peeled off as a header band.
    const make = (text: string, x: number, y: number, w: number, h = 12): Segment => ({
      text,
      x,
      y,
      w,
      h,
      fontSize: h,
      fontName: "F1",
      dir: "ltr",
    });
    const title = make("TITLE", 60, 700, 440, 20);
    const left = [make("L1", 60, 660, 200), make("L2", 60, 645, 200), make("L3", 60, 630, 200)];
    const right = [
      make("R1", 320, 660, 200),
      make("R2", 320, 645, 200),
      make("R3", 320, 630, 200),
    ];
    // Deliberately shuffled input: order must come from geometry, not input order.
    const input = [right[1], left[2], title, right[2], left[0], right[0], left[1]];

    const regions = orderSegments(input, { x0: 0, y0: 0, x1: 612, y1: 792 });

    // Header band, then left column, then right column.
    expect(regions).toHaveLength(3);
    expect(regions[0].map((s) => s.text)).toEqual(["TITLE"]);
    expect(regions[1].map((s) => s.text)).toEqual(["L1", "L2", "L3"]);
    expect(regions[2].map((s) => s.text)).toEqual(["R1", "R2", "R3"]);
    expect(regions.flat().map((s) => s.text)).toEqual([
      "TITLE",
      "L1",
      "L2",
      "L3",
      "R1",
      "R2",
      "R3",
    ]);
  });

  it("returns no regions for an empty segment list", () => {
    expect(orderSegments([], { x0: 0, y0: 0, x1: 612, y1: 792 })).toEqual([]);
  });
});
