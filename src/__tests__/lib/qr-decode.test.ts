import { describe, it, expect, vi, beforeEach } from "vitest";

const jsqrMock = vi.fn();
vi.mock("jsqr", () => ({ default: jsqrMock }));

import { decodeQrFromImageFile } from "@/lib/qr-decode";

// happy-dom has no real image pipeline — stub bitmap + canvas 2D context.
beforeEach(() => {
  jsqrMock.mockReset();
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn().mockResolvedValue({ width: 2, height: 2, close: vi.fn() })
  );
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi
      .fn()
      .mockReturnValue({ data: new Uint8ClampedArray(16), width: 2, height: 2 }),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

describe("decodeQrFromImageFile", () => {
  const file = new File(["fake"], "qr.png", { type: "image/png" });

  it("returns the decoded payload when jsQR finds a code", async () => {
    jsqrMock.mockReturnValue({ data: "otpauth://totp/x?secret=MZXW6YTBOI" });
    await expect(decodeQrFromImageFile(file)).resolves.toBe(
      "otpauth://totp/x?secret=MZXW6YTBOI"
    );
  });

  it("returns null when no QR code is found", async () => {
    jsqrMock.mockReturnValue(null);
    await expect(decodeQrFromImageFile(file)).resolves.toBeNull();
  });

  it("throws image-decode-failed when the file is not a decodable image", async () => {
    (createImageBitmap as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("bad image")
    );
    await expect(decodeQrFromImageFile(file)).rejects.toThrow(
      "image-decode-failed"
    );
  });
});
