import { describe, it, expect, vi } from "vitest";
import { canvasToBlob, drawToCanvas } from "@/lib/image/canvas";

describe("canvas helpers", () => {
  it("canvasToBlob resolves with the blob from toBlob", async () => {
    const canvas = document.createElement("canvas");
    const blob = new Blob(["img"], { type: "image/png" });
    canvas.toBlob = vi.fn((cb: BlobCallback) => cb(blob));
    await expect(canvasToBlob(canvas, "image/png")).resolves.toBe(blob);
  });

  it("canvasToBlob resolves null when toBlob yields null (matches all existing call-site guards)", async () => {
    const canvas = document.createElement("canvas");
    canvas.toBlob = vi.fn((cb: BlobCallback) => cb(null));
    await expect(canvasToBlob(canvas)).resolves.toBeNull();
  });

  it("drawToCanvas returns a canvas of the requested size", () => {
    const source = document.createElement("canvas");
    const ctxStub = { drawImage: vi.fn() } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctxStub);
    const out = drawToCanvas(source, 120, 80);
    expect(out.width).toBe(120);
    expect(out.height).toBe(80);
    expect(ctxStub.drawImage).toHaveBeenCalledWith(source, 0, 0, 120, 80);
  });
});
