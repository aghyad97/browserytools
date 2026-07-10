import { describe, it, expect, vi } from "vitest";

const addFrame = vi.fn();
const on = vi.fn();
const render = vi.fn();
// Function-form implementation (not an arrow) so `new GIF(...)` works under
// Vitest v4, which rejects arrow mockImplementations as non-constructors.
vi.mock("gif.js", () => ({
  default: vi.fn(function () {
    return { addFrame, on, render };
  }),
}));

import { encodeGif } from "@/lib/media/gif-encode";

describe("encodeGif", () => {
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
});
