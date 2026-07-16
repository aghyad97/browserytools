import { describe, it, expect, vi } from "vitest";

// drawToCanvas is mocked to a plain size stub so no real canvas drawing is
// needed. canvasToBlob is stubbed only to satisfy the import (tests always
// pass an explicit `encode`).
vi.mock("@/lib/image/canvas", () => ({
  drawToCanvas: vi.fn((_src: unknown, w: number, h: number) => ({ width: w, height: h })),
  canvasToBlob: vi.fn(),
}));

import { compressToTargetSize } from "@/lib/image/target-size";

/**
 * Deterministic, monotonic size model: size = pixels * quality * K.
 * Records every produced size so tests can assert on real search behaviour.
 */
function sizeEncoder(K: number, sizes: number[]) {
  return async (canvas: HTMLCanvasElement, _type: string, quality: number) => {
    const size = canvas.width * canvas.height * quality * K;
    sizes.push(size);
    return { size } as Blob;
  };
}

const square = (side: number) =>
  ({ width: side, height: side }) as unknown as HTMLImageElement;

describe("compressToTargetSize", () => {
  it("(a) converges within tolerance and reports hitTarget:true", async () => {
    const sizes: number[] = [];
    // 1000x1000, K=0.001 => size = 1000 * quality (range 300..950)
    const res = await compressToTargetSize({
      source: square(1000),
      targetBytes: 800,
      format: "image/jpeg",
      encode: sizeEncoder(0.001, sizes),
    });

    expect(res.hitTarget).toBe(true);
    expect(res.blob.size).toBeLessThanOrEqual(800);
    expect(res.blob.size).toBeGreaterThanOrEqual(0.9 * 800); // inside the -10% window
    expect(res.quality).toBeGreaterThanOrEqual(0.3);
    expect(res.quality).toBeLessThanOrEqual(0.95);
    expect(res.width).toBe(1000);
    expect(res.iterations).toBe(sizes.length);
    expect(res.iterations).toBeGreaterThan(0);
  });

  it("(b) early-accepts on the first probe that lands inside the -10% window", async () => {
    const sizes: number[] = [];
    // First probe quality = (0.3+0.95)/2 = 0.625 => size = 625, inside [585,650].
    const res = await compressToTargetSize({
      source: square(1000),
      targetBytes: 650,
      format: "image/jpeg",
      encode: sizeEncoder(0.001, sizes),
    });

    expect(res.hitTarget).toBe(true);
    expect(res.iterations).toBe(1);
    expect(res.quality).toBeCloseTo(0.625, 10);
    expect(res.blob.size).toBe(625);
  });

  it("(c) steps dimensions down when floor-quality full-dim output exceeds target", async () => {
    const sizes: number[] = [];
    // Full-dim floor (~q0.30) size ~= 300 > 100, so a dimension step-down must occur.
    const res = await compressToTargetSize({
      source: square(1000),
      targetBytes: 100,
      format: "image/jpeg",
      minWidth: 160,
      encode: sizeEncoder(0.001, sizes),
    });

    expect(res.width).toBeLessThan(1000); // stepped down
    expect(res.width).toBeGreaterThanOrEqual(160); // never below the floor
    expect(res.height).toBe(res.width); // aspect preserved (square source)
  });

  it("(d) returns the smallest probe with hitTarget:false for an unreachable target", async () => {
    const sizes: number[] = [];
    // Absolute floor is ~ minWidth^2 * 0.30 * K ~= 7.7 bytes, so 1 byte is unreachable.
    const res = await compressToTargetSize({
      source: square(1000),
      targetBytes: 1,
      format: "image/jpeg",
      minWidth: 160,
      encode: sizeEncoder(0.001, sizes),
    });

    expect(res.hitTarget).toBe(false);
    expect(res.blob.size).toBe(Math.min(...sizes)); // smallest probe actually produced
    expect(res.width).toBe(160); // clamped to the dimension floor
  });

  it("(e) never upscales — result width stays <= source width", async () => {
    const sizes: number[] = [];
    // Non-square, tiny sizes vs a huge target: every probe is under target.
    const source = { width: 400, height: 300 } as unknown as HTMLImageElement;
    const res = await compressToTargetSize({
      source,
      targetBytes: 1_000_000_000,
      format: "image/webp",
      encode: sizeEncoder(0.001, sizes),
    });

    expect(res.hitTarget).toBe(true);
    expect(res.width).toBeLessThanOrEqual(400);
    expect(res.width).toBe(400); // full natural dimensions retained
    expect(res.height).toBe(300);
  });

  it("(f) rejects with 'encode-failed' when the encoder always returns null", async () => {
    const encode = vi.fn(async () => null);
    await expect(
      compressToTargetSize({
        source: square(1000),
        targetBytes: 800,
        format: "image/jpeg",
        encode,
      }),
    ).rejects.toThrow("encode-failed");
    expect(encode).toHaveBeenCalled();
  });
});
