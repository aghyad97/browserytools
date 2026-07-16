import { describe, it, expect } from "vitest";
import {
  ASPECT_PRESETS,
  clamp,
  fitRectToAspect,
  moveRect,
  rectToSourcePixels,
  resizeRect,
  type CropRect,
} from "@/lib/image/crop-rect";

const BASE: CropRect = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };

describe("crop-rect math", () => {
  describe("ASPECT_PRESETS", () => {
    it("exposes free + five ratios in order", () => {
      expect(ASPECT_PRESETS.map((p) => p.id)).toEqual([
        "free",
        "square",
        "4:3",
        "3:4",
        "16:9",
        "9:16",
      ]);
      expect(ASPECT_PRESETS[0].ratio).toBeNull();
      expect(ASPECT_PRESETS[1].ratio).toBe(1);
      expect(ASPECT_PRESETS[4].ratio).toBeCloseTo(16 / 9);
    });
  });

  describe("clamp", () => {
    it("bounds a value between min and max", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-2, 0, 10)).toBe(0);
      expect(clamp(99, 0, 10)).toBe(10);
    });
  });

  describe("rectToSourcePixels", () => {
    it("maps {0.1,0.1,0.8,0.8} on 1000x500 to {sx:100,sy:50,sw:800,sh:400}", () => {
      expect(rectToSourcePixels(BASE, 1000, 500)).toEqual({
        sx: 100,
        sy: 50,
        sw: 800,
        sh: 400,
      });
    });

    it("clamps width/height to a minimum of 1px", () => {
      const tiny: CropRect = { x: 0, y: 0, w: 0.0001, h: 0.0001 };
      const px = rectToSourcePixels(tiny, 100, 100);
      expect(px.sw).toBe(1);
      expect(px.sh).toBe(1);
    });
  });

  describe("fitRectToAspect", () => {
    it("returns the rect unchanged for a free (null) aspect", () => {
      expect(fitRectToAspect(BASE, null, 1000, 1000)).toEqual(BASE);
    });

    it("keeps a centered square rect centered on a square image", () => {
      const r = fitRectToAspect(BASE, 1, 1000, 1000);
      expect(r).toEqual({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
      // center preserved
      expect(r.x + r.w / 2).toBeCloseTo(0.5);
      expect(r.y + r.h / 2).toBeCloseTo(0.5);
    });

    it("re-fits width-derived height for a landscape ratio and respects bounds", () => {
      const r = fitRectToAspect(BASE, 16 / 9, 1000, 1000);
      expect(r.w).toBeCloseTo(0.8);
      expect(r.h).toBeCloseTo(0.45);
      // pixel aspect equals target ratio
      expect((r.w * 1000) / (r.h * 1000)).toBeCloseTo(16 / 9);
      expect(r.x + r.w).toBeLessThanOrEqual(1);
      expect(r.y + r.h).toBeLessThanOrEqual(1);
    });

    it("clamps height to 1 and derives width when the fit overflows", () => {
      const r = fitRectToAspect(BASE, 9 / 16, 1000, 1000);
      expect(r.h).toBe(1);
      expect(r.w).toBeCloseTo(0.5625);
      expect(r.y).toBe(0);
      expect(r.y + r.h).toBeLessThanOrEqual(1);
    });
  });

  describe("moveRect", () => {
    it("translates within bounds", () => {
      const r = moveRect({ x: 0.1, y: 0.1, w: 0.5, h: 0.5 }, 0.1, 0.05);
      expect(r.x).toBeCloseTo(0.2);
      expect(r.y).toBeCloseTo(0.15);
      expect(r.w).toBe(0.5);
      expect(r.h).toBe(0.5);
    });

    it("clamps at the far edges", () => {
      const r = moveRect(BASE, 0.5, 0.5);
      expect(r.x).toBeCloseTo(0.2);
      expect(r.y).toBeCloseTo(0.2);
      expect(r.x + r.w).toBeLessThanOrEqual(1);
      expect(r.y + r.h).toBeLessThanOrEqual(1);
    });

    it("clamps at the near edges", () => {
      expect(moveRect(BASE, -0.5, -0.5)).toEqual({ x: 0, y: 0, w: 0.8, h: 0.8 });
    });
  });

  describe("resizeRect", () => {
    it("resizes freely when aspect is null", () => {
      const r = resizeRect({ x: 0.1, y: 0.1, w: 0.4, h: 0.4 }, 0.2, 0.1, null, 1000, 1000);
      expect(r.w).toBeCloseTo(0.6);
      expect(r.h).toBeCloseTo(0.5);
      expect(r.x).toBe(0.1);
      expect(r.y).toBe(0.1);
    });

    it("clamps to the minimum size", () => {
      const r = resizeRect({ x: 0.1, y: 0.1, w: 0.4, h: 0.4 }, -0.5, -0.5, null, 1000, 1000);
      expect(r.w).toBeCloseTo(0.05);
      expect(r.h).toBeCloseTo(0.05);
    });

    it("honors an aspect lock, deriving height from width", () => {
      const r = resizeRect({ x: 0.1, y: 0.1, w: 0.4, h: 0.4 }, 0.2, 0, 1, 1000, 1000);
      expect(r.w).toBeCloseTo(0.6);
      expect(r.h).toBeCloseTo(0.6);
    });

    it("keeps a square in pixel space on a non-square image", () => {
      const r = resizeRect({ x: 0.1, y: 0.1, w: 0.4, h: 0.2 }, 0.2, 0, 1, 1000, 500);
      // width would grow to 0.6 → h = 0.6 / (1/(1000/500)) = 1.2 → overflow clamps
      expect((r.w * 1000).toFixed(0)).toBe((r.h * 500).toFixed(0));
      expect(r.y + r.h).toBeLessThanOrEqual(1);
    });

    it("clamps aspect-locked height at the bottom edge and re-derives width", () => {
      const r = resizeRect({ x: 0.1, y: 0.8, w: 0.4, h: 0.15 }, 0.2, 0, 1, 1000, 1000);
      expect(r.h).toBeCloseTo(0.2);
      expect(r.w).toBeCloseTo(0.2);
      expect(r.y + r.h).toBeLessThanOrEqual(1);
    });
  });
});
