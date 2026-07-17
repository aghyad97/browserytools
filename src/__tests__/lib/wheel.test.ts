import { describe, expect, it } from "vitest";
import { indexAtPointer, segmentAngle, segmentColor, targetRotation } from "@/lib/wheel";

describe("wheel", () => {
  it("segmentAngle divides the circle", () => expect(segmentAngle(4)).toBeCloseTo(Math.PI / 2));

  it("targetRotation lands the pointer on the chosen index", () => {
    for (const count of [3, 5, 8]) {
      for (let idx = 0; idx < count; idx++) {
        const rot = targetRotation(0, idx, count, 5);
        expect(rot).toBeGreaterThan(0);
        expect(indexAtPointer(rot, count)).toBe(idx);
      }
    }
  });

  it("targetRotation always advances forward", () => {
    expect(targetRotation(10, 0, 5, 3)).toBeGreaterThan(10);
  });

  it("segmentColor cycles a fixed palette of at least 8 colors", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 8; i++) {
      const color = segmentColor(i);
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      seen.add(color);
    }
    expect(seen.size).toBeGreaterThanOrEqual(8);
    // cycles: index i and i + paletteLength must match
    expect(segmentColor(0)).toBe(segmentColor(seen.size));
  });
});
