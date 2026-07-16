import { PDFDocument, degrees } from "pdf-lib";

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
 * pdf-lib `page.drawImage` parameters that place a signature so it both sits in
 * the mapped region AND displays UPRIGHT once the viewer honors the page's
 * `/Rotate`. `placementToRect` alone only fixes the region: `drawImage` would
 * still stamp the PNG axis-aligned in UNROTATED MediaBox space, and the viewer's
 * clockwise `/Rotate` would then show it sideways (90/270) or upside-down (180).
 * The fix counter-rotates the image so the viewer's rotation brings it back
 * upright, translating the draw origin so the rotated image's bounding box still
 * exactly fills the mapped rect.
 *
 * Derivation
 * ----------
 * The viewer displays the MediaBox rotated CLOCKWISE by R (= `/Rotate`); this is
 * the same model `placementToRect`/`viewerPointToUnrotated` invert for the
 * region. So a MediaBox direction appears in the viewer rotated CW by R:
 *   R=90 : +y→screen-right, +x→screen-down (so -x→screen-up)
 *   R=180: +y→screen-down,  +x→screen-left
 *   R=270: +x→screen-up,    +y→screen-left (so -y→screen-right)
 * For the drawn image to read upright, its "up" (+t) must land on screen-up and
 * its "right" (+s) on screen-right. pdf-lib rotates CCW for positive angles
 * (cm = cos,sin,-sin,cos), and image-up world dir = (-sinθ, cosθ),
 * image-right = (cosθ, sinθ). Solving:
 *   R=0 → θ=0 ; R=90 → θ=+90 ; R=180 → θ=180 ; R=270 → θ=+270 (≡ -90).
 * i.e. rotateDeg = R  (NOT -R — an upright signature drawn with -R would read
 * mirrored/upside-down; verified corner-by-corner and by the bbox invariant
 * below).
 *
 * `drawImage` applies translate(x,y) → rotate(θ) → scale(width,height) → unit
 * square, so it pivots about (x,y) (the image's local bottom-left) and
 * `width`/`height` scale the image's LOCAL right/up axes before rotation. Thus
 * for 90/270 the on-page bounding box swaps the drawn dims: because
 * `placementToRect` already swaps the RECT dims for 90/270, the drawn
 * `width`/`height` are the PRE-swap (viewer-perceived) dims — width=rh,
 * height=rw. Placing corners = (x,y)+R(θ)·(width·s, height·t) and pinning the
 * bbox min to the mapped rect's bottom-left (rx,ry) gives, with mapped rect
 * (rx,ry,rw,rh):
 *   R=0  : x=rx,      y=ry,      w=rw, h=rh, θ=0
 *   R=90 : x=rx+rw,   y=ry,      w=rh, h=rw, θ=90
 *   R=180: x=rx+rw,   y=ry+rh,   w=rw, h=rh, θ=180
 *   R=270: x=rx,      y=ry+rh,   w=rh, h=rw, θ=270
 * In every case the rotated image's axis-aligned bbox = (rx,ry,rw,rh), so the
 * region mapping is preserved exactly (pinned by tests via the bbox invariant).
 *
 * Pure and unit-tested independently of pdf-lib.
 */
export function signDrawParams(
  placement: SignPlacement,
  pageWidth: number,
  pageHeight: number,
): { x: number; y: number; width: number; height: number; rotateDeg: number } {
  const rotation = normalizeRotation(placement.pageRotation);
  const {
    x: rx,
    y: ry,
    width: rw,
    height: rh,
  } = placementToRect(placement, pageWidth, pageHeight);

  switch (rotation) {
    case 90:
      return { x: rx + rw, y: ry, width: rh, height: rw, rotateDeg: 90 };
    case 180:
      return { x: rx + rw, y: ry + rh, width: rw, height: rh, rotateDeg: 180 };
    case 270:
      return { x: rx, y: ry + rh, width: rh, height: rw, rotateDeg: 270 };
    default:
      return { x: rx, y: ry, width: rw, height: rh, rotateDeg: 0 };
  }
}

/**
 * Stamp a signature PNG onto a single page of a PDF at a normalized top-left
 * placement. Uses pdf-lib's `embedPng` + `page.drawImage`; only the target page
 * is touched. The image is drawn in UNROTATED MediaBox space and
 * counter-rotated (see `signDrawParams`) so it sits in the mapped region AND
 * displays upright once a viewer honors the page's `/Rotate`.
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
  const { x, y, width: w, height: h, rotateDeg } = signDrawParams(
    placement,
    width,
    height,
  );
  page.drawImage(png, { x, y, width: w, height: h, rotate: degrees(rotateDeg) });

  return doc.save();
}
