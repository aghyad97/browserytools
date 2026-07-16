import { describe, it, expect, vi } from "vitest";
import {
  ANCHORS,
  anchorPosition,
  drawWatermark,
  type Anchor,
  type WatermarkOptions,
} from "@/lib/image/watermark-draw";

/** A mock 2D context that records the calls drawWatermark makes on it. */
function makeCtx() {
  const alphaLog: number[] = [];
  const ctx = {
    _alpha: 1,
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn(() => ({ width: 50 })),
    font: "",
    fillStyle: "",
    textBaseline: "",
  } as unknown as CanvasRenderingContext2D & { _alpha: number };
  Object.defineProperty(ctx, "globalAlpha", {
    get() {
      return this._alpha;
    },
    set(v: number) {
      this._alpha = v;
      alphaLog.push(v);
    },
  });
  return { ctx, alphaLog };
}

const baseText: WatermarkOptions = {
  kind: "text",
  text: "© Test",
  fontSize: 48,
  color: "#ffffff",
  opacity: 70,
  anchor: "bottom-right",
  scale: 100,
  rotation: 0,
  tile: false,
  image: null,
};

describe("watermark-draw", () => {
  describe("ANCHORS", () => {
    it("exposes the nine anchors in reading order", () => {
      expect(ANCHORS).toEqual([
        "top-left",
        "top",
        "top-right",
        "left",
        "center",
        "right",
        "bottom-left",
        "bottom",
        "bottom-right",
      ]);
    });
  });

  describe("anchorPosition", () => {
    // 1000x1000 canvas, 100x100 mark → 3% padding = 30px.
    const cases: Record<Anchor, { x: number; y: number }> = {
      "top-left": { x: 30, y: 30 },
      top: { x: 450, y: 30 },
      "top-right": { x: 870, y: 30 },
      left: { x: 30, y: 450 },
      center: { x: 450, y: 450 },
      right: { x: 870, y: 450 },
      "bottom-left": { x: 30, y: 870 },
      bottom: { x: 450, y: 870 },
      "bottom-right": { x: 870, y: 870 },
    };
    for (const anchor of ANCHORS) {
      it(`positions ${anchor} correctly`, () => {
        expect(anchorPosition(anchor, 1000, 1000, 100, 100)).toEqual(
          cases[anchor]
        );
      });
    }

    it("scales the 3% padding to the smaller canvas side", () => {
      // min(500, 2000) = 500 → pad = 15.
      expect(anchorPosition("top-left", 2000, 500, 100, 100)).toEqual({
        x: 15,
        y: 15,
      });
    });
  });

  describe("drawWatermark", () => {
    it("sets globalAlpha to opacity/100 while drawing, then restores it to 1", () => {
      const { ctx, alphaLog } = makeCtx();
      drawWatermark(ctx, 1000, 1000, baseText);
      expect(alphaLog).toContain(0.7);
      expect(ctx.globalAlpha).toBe(1);
    });

    it("rotates by the given angle when rotation is non-zero", () => {
      const { ctx } = makeCtx();
      drawWatermark(ctx, 1000, 1000, { ...baseText, rotation: 45 });
      expect(ctx.rotate).toHaveBeenCalledWith((45 * Math.PI) / 180);
    });

    it("draws a single text mark when not tiling", () => {
      const { ctx } = makeCtx();
      drawWatermark(ctx, 1000, 1000, baseText);
      expect(ctx.fillText).toHaveBeenCalledTimes(1);
    });

    it("draws many text marks when tiling", () => {
      const { ctx } = makeCtx();
      drawWatermark(ctx, 1000, 1000, { ...baseText, tile: true });
      expect((ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(1);
    });

    it("draws an image mark using the provided element", () => {
      const { ctx } = makeCtx();
      const image = { width: 100, height: 50 } as HTMLImageElement;
      drawWatermark(ctx, 1000, 1000, {
        ...baseText,
        kind: "image",
        image,
      });
      expect(ctx.drawImage).toHaveBeenCalledTimes(1);
      expect(ctx.fillText).not.toHaveBeenCalled();
    });

    it("tiles image marks when tile is on", () => {
      const { ctx } = makeCtx();
      const image = { width: 100, height: 50 } as HTMLImageElement;
      drawWatermark(ctx, 1000, 1000, {
        ...baseText,
        kind: "image",
        image,
        tile: true,
      });
      expect((ctx.drawImage as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(1);
    });

    it("is a no-op safe path for image kind with no image", () => {
      const { ctx } = makeCtx();
      drawWatermark(ctx, 1000, 1000, { ...baseText, kind: "image", image: null });
      expect(ctx.drawImage).not.toHaveBeenCalled();
      expect(ctx.globalAlpha).toBe(1);
    });
  });
});
