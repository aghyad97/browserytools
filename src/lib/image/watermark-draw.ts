/**
 * Pure watermark-drawing logic, extracted verbatim from ImageResizer's watermark
 * tab (`anchorPosition` / `runWatermark`) so both ImageResizer and the standalone
 * WatermarkImage tool share one implementation. No React — only a Canvas 2D
 * context is touched, and the caller is responsible for drawing the base image
 * first and for loading any watermark `HTMLImageElement` before calling
 * `drawWatermark`.
 */

export type WatermarkKind = "text" | "image";

/** 3×3 anchor grid. Short names denote the two axes: a bare "top"/"bottom"
 * centers horizontally, "left"/"right" centers vertically, "center" centers
 * both. */
export type Anchor =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

/** Anchors in reading order — matches the 3×3 grid the UI renders. */
export const ANCHORS: Anchor[] = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
];

export interface WatermarkOptions {
  kind: WatermarkKind;
  /** Text to draw when `kind === "text"`. */
  text: string;
  /** Base font size in px (before `scale`). */
  fontSize: number;
  /** Fill color for text marks (CSS color string). */
  color: string;
  /** 0..100 — mapped to `ctx.globalAlpha` as `opacity / 100`. */
  opacity: number;
  anchor: Anchor;
  /** Percentage scale (100 = base). Text scales the font; image scales width. */
  scale: number;
  /** Rotation in degrees, applied about each mark's center. */
  rotation: number;
  /** When true, the mark repeats across the whole canvas instead of anchoring. */
  tile: boolean;
  /** Pre-loaded watermark image when `kind === "image"`. */
  image?: HTMLImageElement | null;
}

/**
 * Top-left pixel where a mark of `iw`×`ih` should be drawn on a `cw`×`ch`
 * canvas for the given `anchor`. Padding is 3% of the smaller canvas side.
 * A bare "top"/"bottom" centers horizontally; "left"/"right" centers
 * vertically; "center" centers both.
 */
export function anchorPosition(
  anchor: Anchor,
  cw: number,
  ch: number,
  iw: number,
  ih: number
): { x: number; y: number } {
  const pad = Math.round(Math.min(cw, ch) * 0.03);
  const horizontal = anchor.includes("left")
    ? "left"
    : anchor.includes("right")
      ? "right"
      : "center";
  const vertical = anchor.includes("top")
    ? "top"
    : anchor.includes("bottom")
      ? "bottom"
      : "center";
  let x = pad;
  let y = pad;
  if (horizontal === "center") x = (cw - iw) / 2;
  else if (horizontal === "right") x = cw - iw - pad;
  if (vertical === "center") y = (ch - ih) / 2;
  else if (vertical === "bottom") y = ch - ih - pad;
  return { x, y };
}

/**
 * Composite a watermark onto `ctx` (which must already hold the base image).
 * Sets `globalAlpha` from `opacity`, draws either a text or image mark — once at
 * the anchored position, or tiled across the canvas — and restores
 * `globalAlpha` to 1. Each mark is rotated about its own center.
 */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  opts: WatermarkOptions
): void {
  const {
    kind,
    text,
    fontSize,
    color,
    opacity,
    anchor,
    scale,
    rotation,
    tile,
    image,
  } = opts;

  ctx.globalAlpha = opacity / 100;

  if (kind === "text") {
    const fontPx = Math.max(1, Math.round(fontSize * (scale / 100)));
    ctx.font = `${fontPx}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    const metrics = ctx.measureText(text);
    const itemW = metrics.width || fontPx * text.length;
    const itemH = fontPx;
    const drawOne = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x + itemW / 2, y + itemH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(text, -itemW / 2, -itemH / 2);
      ctx.restore();
    };
    if (tile) {
      const stepX = itemW + fontPx;
      const stepY = itemH + fontPx;
      for (let y = 0; y < canvasH; y += stepY) {
        for (let x = 0; x < canvasW; x += stepX) {
          drawOne(x, y);
        }
      }
    } else {
      const { x, y } = anchorPosition(anchor, canvasW, canvasH, itemW, itemH);
      drawOne(x, y);
    }
  } else {
    const wmImg = image;
    if (!wmImg) {
      ctx.globalAlpha = 1;
      return;
    }
    const baseW = canvasW * 0.25 * (scale / 100);
    const ratio = wmImg.height / (wmImg.width || 1);
    const itemW = baseW;
    const itemH = baseW * ratio;
    const drawOne = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x + itemW / 2, y + itemH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(wmImg, -itemW / 2, -itemH / 2, itemW, itemH);
      ctx.restore();
    };
    if (tile) {
      const stepX = itemW + itemW * 0.5;
      const stepY = itemH + itemH * 0.5;
      for (let y = 0; y < canvasH; y += stepY) {
        for (let x = 0; x < canvasW; x += stepX) {
          drawOne(x, y);
        }
      }
    } else {
      const { x, y } = anchorPosition(anchor, canvasW, canvasH, itemW, itemH);
      drawOne(x, y);
    }
  }

  ctx.globalAlpha = 1;
}
