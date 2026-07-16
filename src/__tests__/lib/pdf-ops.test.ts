import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { rotatePdf } from "@/lib/pdf/rotate";
import { reorderPdf } from "@/lib/pdf/reorder";
import {
  watermarkPdf,
  watermarkPosition,
  type PdfWatermarkOptions,
} from "@/lib/pdf/watermark";

/**
 * Build a doc whose pages have distinguishing sizes so reorder/delete can be
 * verified by inspecting page dimensions after the op.
 * Page 0: 100x100, Page 1: 200x200, Page 2: 300x300.
 */
async function makeDoc(sizes: [number, number][]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (const [w, h] of sizes) {
    doc.addPage([w, h]);
  }
  return doc.save();
}

const THREE: [number, number][] = [
  [100, 100],
  [200, 200],
  [300, 300],
];

describe("rotatePdf", () => {
  it("sets absolute rotation on targeted pages and leaves others at 0", async () => {
    const bytes = await makeDoc(THREE);
    const out = await rotatePdf(bytes, { 0: 90, 2: 270 });
    const doc = await PDFDocument.load(out);
    expect(doc.getPage(0).getRotation().angle).toBe(90);
    expect(doc.getPage(1).getRotation().angle).toBe(0);
    expect(doc.getPage(2).getRotation().angle).toBe(270);
  });

  it("applies rotation absolutely, not additively, over an existing rotation", async () => {
    const bytes = await makeDoc(THREE);
    // First rotate page 0 to 90.
    const once = await rotatePdf(bytes, { 0: 90 });
    // Now set page 0 to 180 — must be 180, not 270 (90+180).
    const twice = await rotatePdf(once, { 0: 180 });
    const doc = await PDFDocument.load(twice);
    expect(doc.getPage(0).getRotation().angle).toBe(180);
  });

  it("handles a 0-degree entry (explicit reset)", async () => {
    const bytes = await makeDoc(THREE);
    const rotated = await rotatePdf(bytes, { 1: 90 });
    const reset = await rotatePdf(rotated, { 1: 0 });
    const doc = await PDFDocument.load(reset);
    expect(doc.getPage(1).getRotation().angle).toBe(0);
  });
});

describe("reorderPdf", () => {
  it("reorders to [2,0]: 2 pages, in that order (by distinguishing size)", async () => {
    const bytes = await makeDoc(THREE);
    const out = await reorderPdf(bytes, [2, 0]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getWidth()).toBe(300);
    expect(doc.getPage(1).getWidth()).toBe(100);
  });

  it("deletes omitted pages", async () => {
    const bytes = await makeDoc(THREE);
    const out = await reorderPdf(bytes, [1]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(1);
    expect(doc.getPage(0).getWidth()).toBe(200);
  });

  it("supports a single-page reorder", async () => {
    const bytes = await makeDoc([[150, 150]]);
    const out = await reorderPdf(bytes, [0]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(1);
    expect(doc.getPage(0).getWidth()).toBe(150);
  });

  it("throws invalid-order on empty order", async () => {
    const bytes = await makeDoc(THREE);
    await expect(reorderPdf(bytes, [])).rejects.toThrow("invalid-order");
  });

  it("throws invalid-order on out-of-range index", async () => {
    const bytes = await makeDoc(THREE);
    await expect(reorderPdf(bytes, [5])).rejects.toThrow("invalid-order");
  });

  it("throws invalid-order on duplicate index", async () => {
    const bytes = await makeDoc(THREE);
    await expect(reorderPdf(bytes, [0, 0])).rejects.toThrow("invalid-order");
  });
});

describe("watermarkPdf", () => {
  const base: PdfWatermarkOptions = {
    text: "CONFIDENTIAL",
    fontSize: 24,
    opacity: 50,
    anchor: "diagonal",
    color: { r: 1, g: 0, b: 0 },
  };

  it("reloads cleanly, preserves page count, and grows every page's content stream", async () => {
    const bytes = await makeDoc(THREE);
    const before = await PDFDocument.load(bytes);
    const beforeLens = before
      .getPages()
      .map((p) => (p.node.Contents() ? 1 : 0));
    // Baseline pages have no content stream.
    expect(beforeLens.every((n) => n === 0)).toBe(true);

    const out = await watermarkPdf(bytes, base);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(3);
    for (const page of doc.getPages()) {
      expect(page.node.Contents()).toBeTruthy();
    }
    // Output is larger than input (drew text on every page).
    expect(out.length).toBeGreaterThan(bytes.length);
  });

  const anchors: PdfWatermarkOptions["anchor"][] = [
    "diagonal",
    "center",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ];
  for (const anchor of anchors) {
    it(`executes anchor=${anchor} without throwing`, async () => {
      const bytes = await makeDoc(THREE);
      const out = await watermarkPdf(bytes, { ...base, anchor });
      const doc = await PDFDocument.load(out);
      expect(doc.getPageCount()).toBe(3);
    });
  }

  for (const opacity of [0, 25, 100]) {
    it(`executes opacity=${opacity} without throwing`, async () => {
      const bytes = await makeDoc(THREE);
      const out = await watermarkPdf(bytes, { ...base, opacity });
      const doc = await PDFDocument.load(out);
      expect(doc.getPageCount()).toBe(3);
    });
  }

  it("throws empty-text on empty string", async () => {
    const bytes = await makeDoc(THREE);
    await expect(watermarkPdf(bytes, { ...base, text: "" })).rejects.toThrow(
      "empty-text",
    );
  });

  it("throws empty-text on whitespace-only string", async () => {
    const bytes = await makeDoc(THREE);
    await expect(watermarkPdf(bytes, { ...base, text: "   " })).rejects.toThrow(
      "empty-text",
    );
  });
});

describe("watermarkPosition", () => {
  const PAGE_W = 612;
  const PAGE_H = 792;
  const TEXT_W = 130;
  const TEXT_H = 48;

  it("top-left: inset by 4% padding from the top-left corner", () => {
    const pos = watermarkPosition("top-left", PAGE_W, PAGE_H, TEXT_W, TEXT_H);
    expect(pos.x).toBeCloseTo(24.48);
    expect(pos.y).toBeCloseTo(712.32);
    expect(pos.rotate).toBe(0);
  });

  it("bottom-right: inset by 4% padding from the bottom-right corner", () => {
    const pos = watermarkPosition(
      "bottom-right",
      PAGE_W,
      PAGE_H,
      TEXT_W,
      TEXT_H,
    );
    expect(pos.x).toBeCloseTo(PAGE_W - 24.48 - TEXT_W);
    expect(pos.y).toBeCloseTo(31.68);
    expect(pos.rotate).toBe(0);
  });

  it("center: unrotated, text box centered on the page", () => {
    const pos = watermarkPosition("center", PAGE_W, PAGE_H, TEXT_W, TEXT_H);
    expect(pos.x).toBeCloseTo(PAGE_W / 2 - TEXT_W / 2);
    expect(pos.y).toBeCloseTo(PAGE_H / 2 - TEXT_H / 2);
    expect(pos.rotate).toBe(0);
  });

  it("diagonal: rotated 45°, with the *visual* center landing on the page center", () => {
    const pos = watermarkPosition("diagonal", PAGE_W, PAGE_H, TEXT_W, TEXT_H);
    expect(pos.rotate).toBe(45);
    const cos45 = Math.SQRT1_2;
    const sin45 = Math.SQRT1_2;
    // Reversing the origin offset should recover the page center exactly —
    // i.e. the rotated run's visual center, not its origin, is at (cx, cy).
    const visualCenterX = pos.x + (TEXT_W / 2) * cos45 - (TEXT_H / 2) * sin45;
    const visualCenterY = pos.y + (TEXT_W / 2) * sin45 + (TEXT_H / 2) * cos45;
    expect(visualCenterX).toBeCloseTo(PAGE_W / 2);
    expect(visualCenterY).toBeCloseTo(PAGE_H / 2);
  });
});
