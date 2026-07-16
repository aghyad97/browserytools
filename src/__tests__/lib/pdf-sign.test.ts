import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { signPdf, placementToRect, type SignPlacement } from "@/lib/pdf/sign";

// A valid 1×1 red PNG (RGBA), base64. pdf-lib's embedPng accepts it directly.
const PNG_1X1 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==";

function pngBytes(): Uint8Array {
  const bin = atob(PNG_1X1);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Build a multi-page doc with distinguishing sizes (all Letter here). */
async function makeDoc(count: number, size: [number, number] = [612, 792]) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < count; i++) doc.addPage(size);
  return doc.save();
}

describe("placementToRect (y-flip once, TOP-LEFT → pdf-lib BOTTOM-LEFT)", () => {
  it("maps a top-left {0,0,.5,.25} rect on 612×792 to x=0, y=594", () => {
    const rect = placementToRect(
      { pageIndex: 0, x: 0, y: 0, w: 0.5, h: 0.25 },
      612,
      792,
    );
    expect(rect.x).toBeCloseTo(0);
    expect(rect.y).toBeCloseTo(594); // (1 - 0 - 0.25) * 792
    expect(rect.width).toBeCloseTo(306); // 0.5 * 612
    expect(rect.height).toBeCloseTo(198); // 0.25 * 792
  });

  it("maps a bottom-flush rect {y:0.75,h:0.25} to y=0", () => {
    const rect = placementToRect(
      { pageIndex: 0, x: 0.55, y: 0.75, w: 0.3, h: 0.25 },
      612,
      792,
    );
    expect(rect.y).toBeCloseTo(0); // (1 - 0.75 - 0.25) * 792
    expect(rect.x).toBeCloseTo(0.55 * 612);
  });
});

describe("signPdf", () => {
  const placement: SignPlacement = {
    pageIndex: 0,
    x: 0.55,
    y: 0.75,
    w: 0.3,
    h: 0.12,
  };

  it("reloads cleanly, preserves page count, and grows the file", async () => {
    const bytes = await makeDoc(2);
    const out = await signPdf(bytes, pngBytes(), placement);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(out.length).toBeGreaterThan(bytes.length);
  });

  it("draws only on the target page (content stream on page 1, not page 0)", async () => {
    const bytes = await makeDoc(2);
    const before = await PDFDocument.load(bytes);
    // Baseline: no page has a content stream.
    expect(before.getPages().every((p) => !p.node.Contents())).toBe(true);

    const out = await signPdf(bytes, pngBytes(), { ...placement, pageIndex: 1 });
    const doc = await PDFDocument.load(out);
    const [p0, p1] = doc.getPages();
    expect(p1.node.Contents()).toBeTruthy(); // target page drawn
    expect(p0.node.Contents()).toBeFalsy(); // untouched page stays empty
  });

  it("throws invalid-page for an out-of-range page index", async () => {
    const bytes = await makeDoc(1);
    await expect(
      signPdf(bytes, pngBytes(), { ...placement, pageIndex: 5 }),
    ).rejects.toThrow("invalid-page");
  });
});
