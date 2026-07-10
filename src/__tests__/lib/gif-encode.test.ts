import { describe, it, expect, vi, beforeEach } from "vitest";

const addFrame = vi.fn();
const on = vi.fn();
const render = vi.fn();
const abort = vi.fn();
const lastOptions: { value?: Record<string, unknown> } = {};
// Function-form implementation (not an arrow) so `new GIF(...)` works under
// Vitest v4, which rejects arrow mockImplementations as non-constructors.
vi.mock("gif.js", () => ({
  default: vi.fn(function (options: Record<string, unknown>) {
    lastOptions.value = options;
    return { addFrame, on, render, abort };
  }),
}));

import { encodeGif } from "@/lib/media/gif-encode";

describe("encodeGif", () => {
  beforeEach(() => {
    addFrame.mockClear();
    on.mockReset();
    render.mockClear();
    abort.mockClear();
    lastOptions.value = undefined;
  });

  it("adds every frame with its delay, renders, and resolves with the finished blob", async () => {
    const blob = new Blob(["gif"], { type: "image/gif" });
    on.mockImplementation((event: string, cb: (b: Blob) => void) => {
      if (event === "finished") setTimeout(() => cb(blob), 0);
    });
    const canvas = document.createElement("canvas");
    const result = await encodeGif(
      [
        { source: canvas, delayMs: 100 },
        { source: canvas, delayMs: 250 },
      ],
      { width: 320, height: 240 },
    );
    expect(addFrame).toHaveBeenCalledTimes(2);
    expect(addFrame).toHaveBeenNthCalledWith(2, canvas, expect.objectContaining({ delay: 250, copy: true }));
    expect(render).toHaveBeenCalledOnce();
    expect(result).toBe(blob);
  });

  it("passes a string dither algorithm through to gif.js verbatim", async () => {
    const blob = new Blob(["gif"], { type: "image/gif" });
    on.mockImplementation((event: string, cb: (b: Blob) => void) => {
      if (event === "finished") setTimeout(() => cb(blob), 0);
    });
    const canvas = document.createElement("canvas");
    await encodeGif([{ source: canvas, delayMs: 100 }], {
      width: 320,
      height: 240,
      dither: "FloydSteinberg",
    });
    expect(lastOptions.value?.dither).toBe("FloydSteinberg");
  });

  it("aborts the underlying gif instance when the signal fires and rejects", async () => {
    const handlers: Record<string, (b?: Blob) => void> = {};
    on.mockImplementation((event: string, cb: (b?: Blob) => void) => {
      handlers[event] = cb;
    });
    // gif.js emits "abort" after .abort() is called
    abort.mockImplementation(() => handlers["abort"]?.());
    const controller = new AbortController();
    const canvas = document.createElement("canvas");
    const promise = encodeGif([{ source: canvas, delayMs: 100 }], {
      width: 320,
      height: 240,
      signal: controller.signal,
    });
    controller.abort();
    await expect(promise).rejects.toThrow("GIF encode aborted");
    expect(abort).toHaveBeenCalledOnce();
  });

  it("rejects immediately without constructing a GIF when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const canvas = document.createElement("canvas");
    await expect(
      encodeGif([{ source: canvas, delayMs: 100 }], {
        width: 320,
        height: 240,
        signal: controller.signal,
      }),
    ).rejects.toThrow("GIF encode aborted");
    expect(render).not.toHaveBeenCalled();
    expect(lastOptions.value).toBeUndefined();
  });

  it("removes the abort listener once the encode finishes", async () => {
    const blob = new Blob(["gif"], { type: "image/gif" });
    on.mockImplementation((event: string, cb: (b: Blob) => void) => {
      if (event === "finished") setTimeout(() => cb(blob), 0);
    });
    const controller = new AbortController();
    const removeSpy = vi.spyOn(controller.signal, "removeEventListener");
    const canvas = document.createElement("canvas");
    await encodeGif([{ source: canvas, delayMs: 100 }], {
      width: 320,
      height: 240,
      signal: controller.signal,
    });
    expect(removeSpy).toHaveBeenCalledWith("abort", expect.any(Function));
    controller.abort();
    expect(abort).not.toHaveBeenCalled();
  });
});
