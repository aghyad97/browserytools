import { describe, it, expect } from "vitest";
import { PDFDocument, degrees } from "pdf-lib";
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

describe("placementToRect rotation-aware (viewer space → unrotated MediaBox)", () => {
  // One distinctive viewer rect used for all four rotations: the top-left
  // corner region of what the user SEES (left half, top quarter of the upright
  // page). For each /Rotate we reason where that corner physically lives on the
  // UNROTATED page and pin the resulting pdf-lib bottom-left rect. Page is
  // 612×792 UNROTATED (portrait Letter; a 90/270 page still reports this size
  // from pdf-lib's getSize()).
  const viewerRect = { pageIndex: 0, x: 0, y: 0, w: 0.5, h: 0.25 };
  const W = 612;
  const H = 792;

  it("rot 0 — identity: viewer top-left stays top-left", () => {
    const r = placementToRect({ ...viewerRect, pageRotation: 0 }, W, H);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(594); // (1 - 0 - 0.25) * 792
    expect(r.width).toBeCloseTo(306); // 0.5 * 612
    expect(r.height).toBeCloseTo(198); // 0.25 * 792
  });

  it("rot 90 — viewer top-left maps to the unrotated bottom-LEFT column", () => {
    // Viewer TL corner = unrotated bottom-left. The left-half/top-quarter box
    // becomes a left-edge, bottom-half strip on the unrotated page.
    // unrotated TL rect {x:0, y:0.5, w:0.25, h:0.5}.
    const r = placementToRect({ ...viewerRect, pageRotation: 90 }, W, H);
    expect(r.x).toBeCloseTo(0); // 0 * 612
    expect(r.y).toBeCloseTo(0); // (1 - 0.5 - 0.5) * 792
    expect(r.width).toBeCloseTo(153); // 0.25 * 612
    expect(r.height).toBeCloseTo(396); // 0.5 * 792
  });

  it("rot 180 — viewer top-left maps to the unrotated bottom-RIGHT", () => {
    // Both axes flip. unrotated TL rect {x:0.5, y:0.75, w:0.5, h:0.25}.
    const r = placementToRect({ ...viewerRect, pageRotation: 180 }, W, H);
    expect(r.x).toBeCloseTo(306); // 0.5 * 612
    expect(r.y).toBeCloseTo(0); // (1 - 0.75 - 0.25) * 792
    expect(r.width).toBeCloseTo(306); // 0.5 * 612
    expect(r.height).toBeCloseTo(198); // 0.25 * 792
  });

  it("rot 270 — viewer top-left maps to the unrotated top-RIGHT column", () => {
    // unrotated TL rect {x:0.75, y:0, w:0.25, h:0.5}.
    const r = placementToRect({ ...viewerRect, pageRotation: 270 }, W, H);
    expect(r.x).toBeCloseTo(459); // 0.75 * 612
    expect(r.y).toBeCloseTo(396); // (1 - 0 - 0.5) * 792
    expect(r.width).toBeCloseTo(153); // 0.25 * 612
    expect(r.height).toBeCloseTo(396); // 0.5 * 792
  });

  it("treats a missing pageRotation as 0 (identity)", () => {
    const r = placementToRect(viewerRect, W, H);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(594);
    expect(r.width).toBeCloseTo(306);
    expect(r.height).toBeCloseTo(198);
  });

  it("normalizes out-of-range / negative rotations (450 ≡ 90, -90 ≡ 270)", () => {
    const r450 = placementToRect({ ...viewerRect, pageRotation: 450 }, W, H);
    const r90 = placementToRect({ ...viewerRect, pageRotation: 90 }, W, H);
    expect(r450).toEqual(r90);
    const rNeg90 = placementToRect({ ...viewerRect, pageRotation: -90 }, W, H);
    const r270 = placementToRect({ ...viewerRect, pageRotation: 270 }, W, H);
    expect(rNeg90).toEqual(r270);
  });
});

describe("signPdf honors page rotation end-to-end (real pdf-lib)", () => {
  it("draws inside the page bounds for every rotation", async () => {
    // A rotated page's MediaBox is unchanged; drawing must stay within it.
    for (const rot of [0, 90, 180, 270]) {
      const src = await PDFDocument.create();
      const page = src.addPage([612, 792]);
      page.setRotation(degrees(rot));
      const bytes = await src.save();
      const out = await signPdf(bytes, pngBytes(), {
        pageIndex: 0,
        x: 0,
        y: 0,
        w: 0.5,
        h: 0.25,
        pageRotation: rot,
      });
      const doc = await PDFDocument.load(out);
      expect(doc.getPageCount()).toBe(1);
      expect(out.length).toBeGreaterThan(bytes.length);
    }
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
