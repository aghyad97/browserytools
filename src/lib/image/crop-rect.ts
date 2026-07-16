/**
 * Pure crop-rectangle math, extracted verbatim from ImageResizer's crop tab
 * (`applyAspect` / `onCropPointerMove` / `runCrop`) so both ImageResizer and the
 * standalone CropImage tool share one implementation. No DOM, no React — every
 * function is a deterministic transform on a normalized rect.
 *
 * A `CropRect` stores fractions (0..1) of the source image, so the same rect
 * describes the crop regardless of on-screen preview size.
 */

/** Normalized crop rectangle — x/y/w/h are 0..1 fractions of the source image. */
export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Aspect-ratio presets for cropping. `ratio` is pixel width/height; `null` = free.
 * `id` "square" renders as the "1:1" label at call sites.
 */
export const ASPECT_PRESETS: { id: string; ratio: number | null }[] = [
  { id: "free", ratio: null },
  { id: "square", ratio: 1 },
  { id: "4:3", ratio: 4 / 3 },
  { id: "3:4", ratio: 3 / 4 },
  { id: "16:9", ratio: 16 / 9 },
  { id: "9:16", ratio: 9 / 16 },
];

/** Bound `v` to the inclusive `[min, max]` range. */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Re-fit `rect` to a pixel aspect `ratio`, centered on its existing top-left
 * corner (clamped into bounds). Width is preserved; height is derived so the
 * pixel aspect matches. If the derived height overflows the image, height is
 * pinned to 1 and width is re-derived. A `null` aspect returns `rect` unchanged.
 */
export function fitRectToAspect(
  rect: CropRect,
  aspect: number | null,
  imgW: number,
  imgH: number,
): CropRect {
  if (aspect === null) return rect;
  const imgRatio = imgW / imgH;
  // ratio in normalized coords = ratio * (imgH/imgW)
  const normRatio = aspect / imgRatio;
  let w = rect.w;
  let h = w / normRatio;
  if (h > 1) {
    h = 1;
    w = h * normRatio;
  }
  const x = clamp(rect.x, 0, 1 - w);
  const y = clamp(rect.y, 0, 1 - h);
  return { x, y, w, h };
}

/**
 * Translate `rect` by normalized deltas, clamping so it stays fully inside the
 * image (its size is preserved).
 */
export function moveRect(rect: CropRect, dx: number, dy: number): CropRect {
  return {
    ...rect,
    x: clamp(rect.x + dx, 0, 1 - rect.w),
    y: clamp(rect.y + dy, 0, 1 - rect.h),
  };
}

/**
 * Grow/shrink `rect` from its bottom-right corner by normalized deltas. Width and
 * height are clamped to `[0.05, availableSpace]`. When `aspect` is non-null the
 * height is locked to the pixel ratio (re-derived from width), and if that would
 * overflow the bottom edge the height is pinned and width re-derived. The
 * top-left corner never moves.
 */
export function resizeRect(
  rect: CropRect,
  dx: number,
  dy: number,
  aspect: number | null,
  imgW: number,
  imgH: number,
): CropRect {
  let newW = clamp(rect.w + dx, 0.05, 1 - rect.x);
  let newH = clamp(rect.h + dy, 0.05, 1 - rect.y);
  if (aspect !== null) {
    const normRatio = aspect / (imgW / imgH);
    newH = newW / normRatio;
    if (rect.y + newH > 1) {
      newH = 1 - rect.y;
      newW = newH * normRatio;
    }
  }
  return { ...rect, w: newW, h: newH };
}

/**
 * Convert a normalized `rect` to integer source pixels for
 * `ctx.drawImage(img, sx, sy, sw, sh, …)`. Width/height are floored to a
 * minimum of 1px so the crop is never zero-sized.
 */
export function rectToSourcePixels(
  rect: CropRect,
  naturalW: number,
  naturalH: number,
): { sx: number; sy: number; sw: number; sh: number } {
  return {
    sx: Math.round(rect.x * naturalW),
    sy: Math.round(rect.y * naturalH),
    sw: Math.max(1, Math.round(rect.w * naturalW)),
    sh: Math.max(1, Math.round(rect.h * naturalH)),
  };
}
