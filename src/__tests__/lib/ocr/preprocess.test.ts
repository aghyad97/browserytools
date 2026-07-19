import { describe, it, expect, vi, beforeEach } from "vitest";
import { estimateSkew, deskew, binarize, toGrayscale } from "@/lib/ocr/preprocess";

// ── Local, stateful canvas 2D context mock ──────────────────────────────────
// The shared src/test-setup.ts canvas mock returns a fixed 4-byte pixel
// buffer regardless of canvas size — fine for components that only check
// "was drawImage called", useless for pixel-accurate preprocessing. Following
// the existing per-file override convention (see AsciiArt.test.tsx,
// ImageColorPicker.test.tsx), this file installs a real per-canvas pixel
// store so getImageData/putImageData/drawImage round-trip actual data.
const backingStores = new WeakMap<HTMLCanvasElement, Uint8ClampedArray>();

function getStore(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const needed = canvas.width * canvas.height * 4;
  let store = backingStores.get(canvas);
  if (!store || store.length !== needed) {
    store = new Uint8ClampedArray(needed).fill(255); // opaque white by default
    backingStores.set(canvas, store);
  }
  return store;
}

function makeContextFor(canvas: HTMLCanvasElement) {
  return {
    canvas,
    drawImage: vi.fn((source: unknown) => {
      if (source instanceof HTMLCanvasElement) {
        const src = backingStores.get(source);
        if (src) getStore(canvas).set(src.subarray(0, getStore(canvas).length));
      }
    }),
    getImageData: vi.fn(
      (_sx = 0, _sy = 0, sw: number = canvas.width, sh: number = canvas.height) => ({
        data: getStore(canvas).slice(),
        width: sw,
        height: sh,
      })
    ),
    putImageData: vi.fn((imageData: { data: Uint8ClampedArray }) => {
      getStore(canvas).set(imageData.data);
    }),
    createImageData: vi.fn((w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
      width: w,
      height: h,
    })),
  } as unknown as CanvasRenderingContext2D;
}

function installRealCanvasMock() {
  HTMLCanvasElement.prototype.getContext = vi.fn(function (
    this: HTMLCanvasElement,
    type: string
  ) {
    if (type !== "2d") return null;
    return makeContextFor(this);
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

function makeCanvas(width: number, height: number, data: Uint8ClampedArray): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  backingStores.set(canvas, data);
  return canvas;
}

function readPixels(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const ctx = canvas.getContext("2d") as unknown as {
    getImageData: (x: number, y: number, w: number, h: number) => { data: Uint8ClampedArray };
  };
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
}

beforeEach(() => {
  installRealCanvasMock();
});

// ── estimateSkew fixtures ────────────────────────────────────────────────────
// A plain object literal satisfies the structural ImageData shape estimateSkew
// actually reads (.data/.width/.height) — no real canvas needed for these.
interface FakeImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

function makeUprightBars(w: number, h: number, barHeight = 4, gap = 10): FakeImageData {
  const data = new Uint8ClampedArray(w * h * 4).fill(255);
  for (let y = 0; y < h; y++) {
    if (y % (barHeight + gap) >= barHeight) continue;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
    }
  }
  return { data, width: w, height: h };
}

function sampleNearest(img: FakeImageData, sx: number, sy: number): number {
  const ix = Math.round(sx);
  const iy = Math.round(sy);
  if (ix < 0 || ix >= img.width || iy < 0 || iy >= img.height) return 255;
  return img.data[(iy * img.width + ix) * 4];
}

/**
 * Rotate an upright fixture by `angleDeg`, matching preprocess.ts's documented
 * sign convention (a fixture built this way should make `deskew(canvas,
 * angleDeg)` straighten it, and `estimateSkew` should recover `angleDeg`).
 * This intentionally re-derives the inverse-sampling math independently
 * rather than importing it from preprocess.ts, so the test doesn't just
 * confirm the implementation agrees with itself.
 */
function rotateFixture(img: FakeImageData, angleDeg: number): FakeImageData {
  const { width: w, height: h } = img;
  const out = new Uint8ClampedArray(w * h * 4);
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const cx = w / 2;
  const cy = h / 2;

  for (let y = 0; y < h; y++) {
    const dy = y - cy;
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const sx = cx + dx * cos + dy * sin;
      const sy = cy - dx * sin + dy * cos;
      const v = sampleNearest(img, sx, sy);
      const idx = (y * w + x) * 4;
      out[idx] = v;
      out[idx + 1] = v;
      out[idx + 2] = v;
      out[idx + 3] = 255;
    }
  }
  return { data: out, width: w, height: h };
}

describe("estimateSkew", () => {
  it("recovers a known +3 degree skew from rotated horizontal bars", () => {
    const upright = makeUprightBars(120, 120);
    const skewed = rotateFixture(upright, 3);

    const angle = estimateSkew(skewed as unknown as ImageData);

    expect(angle).toBeGreaterThanOrEqual(2);
    expect(angle).toBeLessThanOrEqual(4);
  });

  it("returns ~0 for an unrotated bar image", () => {
    const upright = makeUprightBars(120, 120);

    const angle = estimateSkew(upright as unknown as ImageData);

    expect(Math.abs(angle)).toBeLessThanOrEqual(0.5);
  });

  it("recovers a known -5 degree skew", () => {
    const upright = makeUprightBars(120, 120);
    const skewed = rotateFixture(upright, -5);

    const angle = estimateSkew(skewed as unknown as ImageData);

    expect(angle).toBeGreaterThanOrEqual(-6);
    expect(angle).toBeLessThanOrEqual(-4);
  });

  it("clamps to the [-10, 10] range", () => {
    const upright = makeUprightBars(80, 80);
    const angle = estimateSkew(upright as unknown as ImageData);
    expect(angle).toBeGreaterThanOrEqual(-10);
    expect(angle).toBeLessThanOrEqual(10);
  });
});

describe("deskew", () => {
  it("rotates a marked pixel to the expected location for a 90deg correction", () => {
    const w = 40;
    const h = 40;
    const data = new Uint8ClampedArray(w * h * 4).fill(255);
    // Mark one pixel black at (cx + 10, cy) — 10px to the right of center.
    const cx = w / 2;
    const cy = h / 2;
    const markX = cx + 10;
    const markY = cy;
    data[(markY * w + markX) * 4] = 0;
    data[(markY * w + markX) * 4 + 1] = 0;
    data[(markY * w + markX) * 4 + 2] = 0;

    const canvas = makeCanvas(w, h, data);
    const out = deskew(canvas, 90);
    const pixels = readPixels(out);

    // Per preprocess.ts's documented convention, correcting a +90 skew moves
    // a point 10px right-of-center to 10px above-center.
    const expectedX = cx;
    const expectedY = cy - 10;
    const idx = (expectedY * w + expectedX) * 4;
    expect(pixels[idx]).toBeLessThan(50);
    expect(pixels[idx + 1]).toBeLessThan(50);
    expect(pixels[idx + 2]).toBeLessThan(50);

    // And the original location should no longer be dark.
    const originalIdx = (markY * w + markX) * 4;
    expect(pixels[originalIdx]).toBeGreaterThan(200);
  });

  it("returns a same-size canvas unchanged (modulo fill) for deg=0", () => {
    const w = 20;
    const h = 20;
    const data = new Uint8ClampedArray(w * h * 4).fill(255);
    data[0] = 0;
    data[1] = 0;
    data[2] = 0;
    const canvas = makeCanvas(w, h, data);

    const out = deskew(canvas, 0);

    expect(out.width).toBe(w);
    expect(out.height).toBe(h);
    const pixels = readPixels(out);
    expect(pixels[0]).toBe(0);
  });
});

describe("binarize", () => {
  it("produces only 0 or 255 values in the RGB channels", () => {
    const w = 60;
    const h = 40;
    const data = new Uint8ClampedArray(w * h * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        // Smooth gradient plus a bit of "texture" so it's not perfectly flat.
        const v = 90 + Math.round((x / (w - 1)) * 140) + ((x + y) % 5);
        data[idx] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
    }
    const canvas = makeCanvas(w, h, data);

    const out = binarize(canvas);
    const pixels = readPixels(out);

    for (let i = 0; i < pixels.length; i += 4) {
      expect([0, 255]).toContain(pixels[i]);
      expect([0, 255]).toContain(pixels[i + 1]);
      expect([0, 255]).toContain(pixels[i + 2]);
    }
  });

  it("detects darker text on both dim and brightly-lit regions of an uneven gradient", () => {
    // A global fixed threshold (e.g. 128) only ever catches text in the dim
    // half of a gradient like this — the bright-side text mark stays above
    // 128 in absolute terms. Sauvola's local mean/std should catch both.
    const w = 90;
    const h = 40;
    const data = new Uint8ClampedArray(w * h * 4).fill(255);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const bg = 90 + Math.round((x / (w - 1)) * 140); // 90 (left/dim) .. 230 (right/bright)
        data[idx] = bg;
        data[idx + 1] = bg;
        data[idx + 2] = bg;
        data[idx + 3] = 255;
      }
    }

    // Dim-region "text" block: well below 128 in absolute terms too — the
    // easy case any threshold should catch.
    const dimBlock = { x0: 4, y0: 16, x1: 11, y1: 23, delta: 70 };
    // Bright-region "text" block: stays above 128 in absolute terms
    // (bg ~= 220, delta 70 -> ~150) — only a local/adaptive method should
    // catch this one.
    const brightBlock = { x0: 78, y0: 16, x1: 85, y1: 23, delta: 70 };

    for (const block of [dimBlock, brightBlock]) {
      for (let y = block.y0; y <= block.y1; y++) {
        for (let x = block.x0; x <= block.x1; x++) {
          const idx = (y * w + x) * 4;
          const v = Math.max(0, data[idx] - block.delta);
          data[idx] = v;
          data[idx + 1] = v;
          data[idx + 2] = v;
        }
      }
    }

    // Sanity-check the fixture actually exercises the "global threshold
    // fails" case: the bright block's raw value must sit above 128.
    const brightRaw = data[(20 * w + 81) * 4];
    expect(brightRaw).toBeGreaterThan(128);

    const canvas = makeCanvas(w, h, data);
    const out = binarize(canvas);
    const pixels = readPixels(out);

    const dimCenterIdx = (20 * w + 7) * 4;
    const brightCenterIdx = (20 * w + 81) * 4;
    expect(pixels[dimCenterIdx]).toBe(0);
    expect(pixels[brightCenterIdx]).toBe(0);

    // Pure background far from any text block stays white.
    const backgroundIdx = (20 * w + 45) * 4;
    expect(pixels[backgroundIdx]).toBe(255);
  });
});

describe("toGrayscale", () => {
  it("converts a colored canvas to R=G=B luma values", () => {
    const w = 2;
    const h = 2;
    const data = new Uint8ClampedArray(w * h * 4);
    // A pure red pixel and a pure blue pixel — luma differs, and each
    // channel should collapse to that same value.
    data.set([255, 0, 0, 255], 0);
    data.set([0, 0, 255, 255], 4);
    data.set([0, 255, 0, 255], 8);
    data.set([10, 20, 30, 255], 12);
    const canvas = makeCanvas(w, h, data);

    const gray = toGrayscale(canvas);

    expect(gray.width).toBe(w);
    expect(gray.height).toBe(h);
    for (let i = 0; i < gray.data.length; i += 4) {
      expect(gray.data[i]).toBe(gray.data[i + 1]);
      expect(gray.data[i + 1]).toBe(gray.data[i + 2]);
    }
    // Red channel alone (255,0,0) has luma 0.299*255 ~= 76.
    expect(gray.data[0]).toBeGreaterThanOrEqual(74);
    expect(gray.data[0]).toBeLessThanOrEqual(78);
  });
});
