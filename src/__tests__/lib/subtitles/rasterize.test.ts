import { describe, it, expect, vi, beforeEach } from "vitest";

// JASSUB must never load real wasm/WebGL in tests. This fake records the
// order of the lifecycle calls the rasterizer makes so we can assert the
// render-size is forced explicitly.
//
// Regression: JASSUB derives its render size from the canvas element's
// layout box (clientWidth/clientHeight) unless `resize()` is given explicit
// dimensions. The rasterizer's canvas is DETACHED (clientWidth === 0), so
// without an explicit `resize(false, w, h)` libass renders into a 1×1 buffer
// and every caption falls outside the readback region — the burned MP4 comes
// out completely blank. This test locks in that explicit resize call.
const calls: string[] = [];
let lastResizeArgs: unknown[] | null = null;

class FakeJassub {
  ready = Promise.resolve();
  renderer = { setTrack: vi.fn() };
  manualRender = vi.fn().mockImplementation(async () => {
    calls.push("manualRender");
  });
  resize = vi.fn().mockImplementation(async (...args: unknown[]) => {
    calls.push("resize");
    lastResizeArgs = args;
  });
  destroy = vi.fn().mockImplementation(async () => {
    calls.push("destroy");
  });
  constructor(_opts: Record<string, unknown>) {}
}

vi.mock("jassub", () => ({ default: FakeJassub }));

const { rasterizeCaptionFrames } = await import("@/lib/subtitles/rasterize");

beforeEach(() => {
  calls.length = 0;
  lastResizeArgs = null;
});

describe("rasterizeCaptionFrames", () => {
  it("forces the render surface to the exact dims via resize (not the element's 0-size layout box)", async () => {
    await rasterizeCaptionFrames({
      ass: "dummy",
      dims: { w: 720, h: 1280 },
      duration: 1,
      fps: 8,
    });

    expect(lastResizeArgs).not.toBeNull();
    // resize(forceRepaint=false, renderWidth=720, renderHeight=1280)
    expect(lastResizeArgs).toEqual([false, 720, 1280]);
  });

  it("resizes AFTER the warm-up render and BEFORE the capture loop", async () => {
    await rasterizeCaptionFrames({
      ass: "dummy",
      dims: { w: 640, h: 360 },
      duration: 0.5,
      fps: 8,
    });

    const firstResize = calls.indexOf("resize");
    const firstManual = calls.indexOf("manualRender");
    expect(firstManual).toBeGreaterThanOrEqual(0);
    expect(firstResize).toBeGreaterThan(firstManual); // warm-up render precedes the size force
    // Every capture-loop render must come after the size force.
    const lastManual = calls.lastIndexOf("manualRender");
    expect(lastManual).toBeGreaterThan(firstResize);
  });

  it("emits one PNG frame per tick (ceil(duration*fps)) and tears the instance down", async () => {
    const frames = await rasterizeCaptionFrames({
      ass: "dummy",
      dims: { w: 320, h: 240 },
      duration: 1,
      fps: 8,
    });

    expect(frames).toHaveLength(8);
    expect(frames[0]).toBeInstanceOf(Uint8Array);
    expect(calls).toContain("destroy");
  });
});
