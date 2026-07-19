/**
 * Classical OCR preprocessing: skew estimation/correction and adaptive
 * (Sauvola-style) binarization. Runs entirely on-canvas — no WASM, no
 * network. This feeds tesseract.js, which stays the OCR engine: a measured
 * spike found PaddleOCR 50x worse on degraded scans and 200x worse on
 * Arabic, and its SDK silently falls back to a CDN (a privacy violation for
 * this site). The upgrade here is classical preprocessing, not a new engine.
 *
 * Shared rotation convention (estimateSkew / deskew): a positive `deg` means
 * the page content is rotated clockwise (as drawn on canvas, where +y is
 * down) relative to upright. Correcting a skew of `deg` means rotating the
 * canvas content by `-deg`. `deskew` implements that forward transform via
 * inverse sampling: for a destination pixel offset (dx, dy) from center, the
 * matching source offset is `rotate((dx, dy), +deg)`. `estimateSkew` scores
 * candidate angles the same way in reverse: at candidate angle `a`, a pixel's
 * row bucket is `rotate((dx, dy), -a)`'s y-component — i.e. "if the true
 * skew were `a`, which row would this pixel land on after correction?".
 */

const MIN_SKEW_DEG = -10;
const MAX_SKEW_DEG = 10;
const SKEW_STEP_DEG = 0.5;

/** Bounds how many pixels are sampled per candidate angle so a full-resolution
 *  scanned page doesn't block the main thread for seconds. Skew estimation
 *  doesn't need every pixel — a coarse, evenly-spaced sample is enough to
 *  find the row-alignment peak. */
const MAX_SAMPLE_PIXELS = 250_000;

/**
 * Estimate the skew (rotation, in degrees, clamped to [-10, 10]) of a
 * grayscale image using the projection-profile method: for each candidate
 * angle from -10 to 10 in 0.5-degree steps, bucket every dark pixel into a
 * row after "un-rotating" it by that angle, then score the row-sum variance.
 * Text lines line up into a small number of dense rows at the correct angle,
 * spiking the variance; every other angle smears them across many rows.
 */
export function estimateSkew(gray: ImageData): number {
  const { width: w, height: h, data } = gray;
  if (w < 2 || h < 2) return 0;

  const totalPixels = w * h;
  const stride = Math.max(1, Math.floor(Math.sqrt(totalPixels / MAX_SAMPLE_PIXELS)));

  const cx = w / 2;
  const cy = h / 2;

  let bestAngle = 0;
  let bestVariance = -Infinity;

  // Integer "tenths of a degree" loop counter avoids floating-point step
  // accumulation drift over ~41 iterations.
  for (
    let tenth = MIN_SKEW_DEG * 10;
    tenth <= MAX_SKEW_DEG * 10;
    tenth += SKEW_STEP_DEG * 10
  ) {
    const angleDeg = tenth / 10;
    const rad = (angleDeg * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    const rowSums = new Float64Array(h);

    for (let y = 0; y < h; y += stride) {
      const dy = y - cy;
      const rowOffset = y * w;
      for (let x = 0; x < w; x += stride) {
        const darkness = 255 - data[(rowOffset + x) * 4];
        if (darkness <= 0) continue;

        const dx = x - cx;
        // y-component of rotating (dx, dy) by -angleDeg — see module docstring.
        const ry = -dx * sin + dy * cos;
        const row = Math.round(ry + cy);
        if (row >= 0 && row < h) rowSums[row] += darkness;
      }
    }

    let sum = 0;
    for (let i = 0; i < h; i++) sum += rowSums[i];
    const mean = sum / h;
    let variance = 0;
    for (let i = 0; i < h; i++) {
      const d = rowSums[i] - mean;
      variance += d * d;
    }
    variance /= h;

    if (variance > bestVariance) {
      bestVariance = variance;
      bestAngle = angleDeg;
    }
  }

  return Math.max(MIN_SKEW_DEG, Math.min(MAX_SKEW_DEG, bestAngle));
}

/**
 * Rotate canvas content by `-deg` to correct a measured skew of `deg`.
 * Returns a NEW canvas the same size as the input. Pixels sampled from
 * outside the original bounds are filled white (document background), not
 * black, so a rotated scan doesn't grow dark corners that confuse OCR.
 */
export function deskew(canvas: HTMLCanvasElement, deg: number): HTMLCanvasElement {
  const w = canvas.width;
  const h = canvas.height;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;

  const srcCtx = canvas.getContext("2d");
  const outCtx = out.getContext("2d");
  if (!srcCtx || !outCtx || w === 0 || h === 0) return out;
  if (deg === 0) {
    outCtx.drawImage(canvas, 0, 0);
    return out;
  }

  const src = srcCtx.getImageData(0, 0, w, h);
  const dst = outCtx.createImageData(w, h);

  // Inverse sampling for the "rotate content by -deg" forward transform —
  // see module docstring for the shared sign convention.
  const rad = (deg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const cx = w / 2;
  const cy = h / 2;

  for (let y = 0; y < h; y++) {
    const dy = y - cy;
    const rowOffset = y * w;
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const sx = cx + dx * cos - dy * sin;
      const sy = cy + dx * sin + dy * cos;

      const dstIdx = (rowOffset + x) * 4;
      const ix = Math.round(sx);
      const iy = Math.round(sy);
      if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
        const srcIdx = (iy * w + ix) * 4;
        dst.data[dstIdx] = src.data[srcIdx];
        dst.data[dstIdx + 1] = src.data[srcIdx + 1];
        dst.data[dstIdx + 2] = src.data[srcIdx + 2];
        dst.data[dstIdx + 3] = src.data[srcIdx + 3];
      } else {
        dst.data[dstIdx] = 255;
        dst.data[dstIdx + 1] = 255;
        dst.data[dstIdx + 2] = 255;
        dst.data[dstIdx + 3] = 255;
      }
    }
  }

  outCtx.putImageData(dst, 0, 0);
  return out;
}

const SAUVOLA_WINDOW = 15; // odd; half-width 7px around each pixel
const SAUVOLA_K = 0.2;
const SAUVOLA_R = 128; // standard dynamic range of std-dev for 8-bit grayscale

/**
 * Adaptive local threshold (Sauvola-style binarization): each pixel's
 * threshold is derived from the mean/std-dev of its own neighborhood via
 * summed-area tables, keeping the whole pass O(w*h) regardless of window
 * size. A single global threshold breaks on unevenly-lit photos of paper
 * (phone photos, folded receipts, shadowed corners) — one side binarizes
 * correctly while the other washes out to solid black or solid white.
 * Returns a NEW canvas; output RGB channels are always exactly 0 or 255.
 */
export function binarize(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const w = canvas.width;
  const h = canvas.height;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;

  const srcCtx = canvas.getContext("2d");
  const outCtx = out.getContext("2d");
  if (!srcCtx || !outCtx || w === 0 || h === 0) return out;

  const src = srcCtx.getImageData(0, 0, w, h);
  const gray = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    gray[i] =
      0.299 * src.data[idx] + 0.587 * src.data[idx + 1] + 0.114 * src.data[idx + 2];
  }

  // Summed-area tables (1px zero-padded border) of intensity and intensity²,
  // enabling O(1) box sums for the mean/std-dev of any window below.
  const iw = w + 1;
  const integral = new Float64Array(iw * (h + 1));
  const integralSq = new Float64Array(iw * (h + 1));
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    let rowSumSq = 0;
    for (let x = 0; x < w; x++) {
      const v = gray[y * w + x];
      rowSum += v;
      rowSumSq += v * v;
      const i = (y + 1) * iw + (x + 1);
      integral[i] = integral[i - iw] + rowSum;
      integralSq[i] = integralSq[i - iw] + rowSumSq;
    }
  }

  const boxSum = (table: Float64Array, x0: number, y0: number, x1: number, y1: number) =>
    table[(y1 + 1) * iw + (x1 + 1)] -
    table[y0 * iw + (x1 + 1)] -
    table[(y1 + 1) * iw + x0] +
    table[y0 * iw + x0];

  const half = Math.floor(SAUVOLA_WINDOW / 2);
  const dst = outCtx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - half);
    const y1 = Math.min(h - 1, y + half);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - half);
      const x1 = Math.min(w - 1, x + half);
      const count = (x1 - x0 + 1) * (y1 - y0 + 1);

      const sum = boxSum(integral, x0, y0, x1, y1);
      const sumSq = boxSum(integralSq, x0, y0, x1, y1);
      const mean = sum / count;
      const variance = Math.max(0, sumSq / count - mean * mean);
      const std = Math.sqrt(variance);

      const threshold = mean * (1 + SAUVOLA_K * (std / SAUVOLA_R - 1));
      const value = gray[y * w + x] < threshold ? 0 : 255;

      const idx = (y * w + x) * 4;
      dst.data[idx] = value;
      dst.data[idx + 1] = value;
      dst.data[idx + 2] = value;
      dst.data[idx + 3] = src.data[idx + 3];
    }
  }

  outCtx.putImageData(dst, 0, 0);
  return out;
}

/**
 * Convert a canvas to a grayscale ImageData suitable for `estimateSkew`.
 * Not one of the three primary exports the task interface specifies, but
 * necessary glue: callers hold a canvas (from an <img> or a rendered PDF
 * page), not a pre-converted ImageData.
 */
export function toGrayscale(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  if (!ctx || w === 0 || h === 0) return new ImageData(Math.max(1, w), Math.max(1, h));

  const { data } = ctx.getImageData(0, 0, w, h);
  const gray = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    gray[i] = luma;
    gray[i + 1] = luma;
    gray[i + 2] = luma;
    gray[i + 3] = data[i + 3];
  }
  return new ImageData(gray, w, h);
}
