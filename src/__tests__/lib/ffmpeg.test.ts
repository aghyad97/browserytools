import { describe, it, expect, vi } from "vitest";

const load = vi.fn().mockResolvedValue(undefined);
// FFmpeg is used with `new`, so the mock must be constructable — a `class`
// (matching the repo's CompressVideo test) rather than an arrow-returning
// vi.fn(), which is not a valid constructor under vitest v4.
vi.mock("@ffmpeg/ffmpeg", () => ({
  FFmpeg: class {
    load = load;
    on = vi.fn();
    off = vi.fn();
    loaded = false;
  },
}));
vi.mock("@ffmpeg/util", () => ({
  toBlobURL: vi.fn().mockResolvedValue("blob:mock-core"),
}));

import { getFFmpeg, __resetForTests } from "@/lib/media/ffmpeg";

describe("getFFmpeg", () => {
  it("loads once and returns the same instance on repeat calls", async () => {
    __resetForTests();
    const a = await getFFmpeg();
    const b = await getFFmpeg();
    expect(a).toBe(b);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("clears the cache after a failed load so the next call retries", async () => {
    __resetForTests();
    load.mockRejectedValueOnce(new Error("wasm boom"));
    await expect(getFFmpeg()).rejects.toThrow("wasm boom");
    // A subsequent call must attempt the load again, not return a rejected cache.
    const ok = await getFFmpeg();
    expect(ok).toBeDefined();
    expect(load).toHaveBeenCalledTimes(2);
  });
});
