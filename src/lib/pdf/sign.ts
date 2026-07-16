import { PDFDocument } from "pdf-lib";

/**
 * Where a signature image sits on a page, in a NORMALIZED (0..1) TOP-LEFT
 * coordinate space — `x`/`y` are the top-left corner of the box, `w`/`h` its
 * size, all as fractions of the page width/height. Top-left space matches the
 * on-screen overlay the panel drags/resizes; the y-flip to pdf-lib's
 * bottom-left origin happens exactly ONCE, in `placementToRect`.
 *
 * The rect is captured in VIEWER space — the (upright-looking) page pdf.js
 * renders after honoring the page's `/Rotate`. `pageRotation` records that
 * rotation so the engine can map the rect back onto the UNROTATED pdf-lib
 * MediaBox before drawing.
 */
export interface SignPlacement {
  pageIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * Rotation (degrees, 0/90/180/270) of the viewer space the normalized rect
   * was captured in — i.e. the page's `/Rotate` as honored by pdf.js when it
   * rendered the preview. Defaults to 0 (page displayed unrotated).
   */
  pageRotation?: number;
}

/** Snap an arbitrary rotation to the canonical 0/90/180/270 quadrant. */
function normalizeRotation(rotation: number | undefined): 0 | 90 | 180 | 270 {
  const n = (((Math.round((rotation ?? 0) / 90) * 90) % 360) + 360) % 360;
  return n as 0 | 90 | 180 | 270;
}

/**
 * Map a normalized TOP-LEFT point from VIEWER space (the rotated, upright page
 * the user sees and drags on) back to the UNROTATED page's normalized TOP-LEFT
 * space. `(a, b)` are viewer x-right / y-down; the result is unrotated
 * x-right / y-down.
 *
 * Derivation — pdf.js applies `/Rotate` CLOCKWISE for display, and for 90/270
 * swaps the viewport's width/height. Tracking where each unrotated corner lands
 * in the viewer (verified against pdf.js's PageViewport transform) gives the
 * forward corner maps; inverting them yields the point maps below. With W,H the
 * unrotated page size and the viewer top-left at unrotated:
 *   - rot 0:   viewer TL  = unrotated TL     → identity.
 *   - rot 90:  viewer TL  = unrotated BL     → u = b,     v = 1 - a.
 *   - rot 180: viewer TL  = unrotated BR     → u = 1 - a, v = 1 - b.
 *   - rot 270: viewer TL  = unrotated TR     → u = 1 - b, v = a.
 * (pdf.js rot 90 transform reduces to canvas (cx,cy) = (py, px); rot 270 to
 * (H - py, W - px) — both reproduce these maps exactly.)
 */
function viewerPointToUnrotated(
  a: number,
  b: number,
  rotation: 0 | 90 | 180 | 270,
): [u: number, v: number] {
  switch (rotation) {
    case 90:
      return [b, 1 - a];
    case 180:
      return [1 - a, 1 - b];
    case 270:
      return [1 - b, a];
    default:
      return [a, b];
  }
}

/**
 * Map the normalized TOP-LEFT viewer rect onto the UNROTATED page as a
 * normalized TOP-LEFT rect. A 90°/270° rotation swaps width↔height and moves
 * the corners, but the box stays axis-aligned — so map its four corners and
 * take their bounding box.
 */
function viewerRectToUnrotated(
  placement: SignPlacement,
  rotation: 0 | 90 | 180 | 270,
): { x: number; y: number; w: number; h: number } {
  const { x, y, w, h } = placement;
  const corners: Array<[number, number]> = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  const mapped = corners.map(([a, b]) => viewerPointToUnrotated(a, b, rotation));
  const us = mapped.map((m) => m[0]);
  const vs = mapped.map((m) => m[1]);
  const uMin = Math.min(...us);
  const uMax = Math.max(...us);
  const vMin = Math.min(...vs);
  const vMax = Math.max(...vs);
  return { x: uMin, y: vMin, w: uMax - uMin, h: vMax - vMin };
}

/**
 * Convert a normalized TOP-LEFT placement into pdf-lib draw coordinates
 * (BOTTOM-LEFT origin, page points). Two steps, both pure:
 *   1. Rotate the viewer rect back onto the UNROTATED page (see
 *      `viewerRectToUnrotated`) — a no-op when `pageRotation` is 0.
 *   2. The single y-flip: `y_bottomLeft = (1 - y - h) * pageHeight`, so a box
 *      flush to the top (`y = 0`) sits at `y = (1 - h) * pageHeight` and a box
 *      flush to the bottom (`y + h = 1`) sits at `y = 0`.
 *
 * `pageWidth`/`pageHeight` are the UNROTATED MediaBox size (pdf-lib's
 * `page.getSize()`), which is exactly what step 1 targets. Unit-tested
 * independently of pdf-lib.
 */
export function placementToRect(
  placement: SignPlacement,
  pageWidth: number,
  pageHeight: number,
): { x: number; y: number; width: number; height: number } {
  const rotation = normalizeRotation(placement.pageRotation);
  const { x, y, w, h } = viewerRectToUnrotated(placement, rotation);
  return {
    x: x * pageWidth,
    y: (1 - y - h) * pageHeight,
    width: w * pageWidth,
    height: h * pageHeight,
  };
}

/**
 * Stamp a signature PNG onto a single page of a PDF at a normalized top-left
 * placement. Uses pdf-lib's `embedPng` + `page.drawImage`; only the target page
 * is touched. The rect is drawn in UNROTATED MediaBox space, so it rotates with
 * the page's `/Rotate` when any viewer opens the signed file.
 *
 * @throws Error("invalid-page") when `placement.pageIndex` is out of range.
 */
export async function signPdf(
  bytes: Uint8Array,
  signaturePng: Uint8Array,
  placement: SignPlacement,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  if (
    !Number.isInteger(placement.pageIndex) ||
    placement.pageIndex < 0 ||
    placement.pageIndex >= pages.length
  ) {
    throw new Error("invalid-page");
  }

  const page = pages[placement.pageIndex];
  const { width, height } = page.getSize();
  const png = await doc.embedPng(signaturePng);
  const rect = placementToRect(placement, width, height);
  page.drawImage(png, rect);

  return doc.save();
}
