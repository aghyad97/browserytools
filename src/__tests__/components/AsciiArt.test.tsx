import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AsciiArt from "@/components/AsciiArt";

// happy-dom does not fire <img> load events; resolve onload synchronously so
// generate() can proceed with a known image size.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 40;
  height = 40;
  private _src = "";
  set src(value: string) {
    this._src = value;
    setTimeout(() => this.onload?.(), 0);
  }
  get src() {
    return this._src;
  }
}

// Override the test-setup canvas mock so getImageData returns a real-sized,
// varied buffer. Without this the shared mock returns only 4 bytes and the
// ASCII output would be a single character.
function installCanvasMock() {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi.fn((_x: number, _y: number, w: number, h: number) => {
      const data = new Uint8ClampedArray(w * h * 4);
      for (let i = 0; i < w * h; i++) {
        // Horizontal brightness gradient: dark on the left, bright on the right.
        const col = i % w;
        const v = Math.round((col / Math.max(1, w - 1)) * 255);
        data[i * 4] = v;
        data[i * 4 + 1] = v;
        data[i * 4 + 2] = v;
        data[i * 4 + 3] = 255;
      }
      return { data, width: w, height: h };
    }),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    set fillStyle(_v: string) {},
    set font(_v: string) {},
    set textBaseline(_v: string) {},
  });
  HTMLCanvasElement.prototype.toBlob = vi
    .fn()
    .mockImplementation((cb: BlobCallback) => {
      cb(new Blob(["png"], { type: "image/png" }));
    });
}

beforeEach(() => {
  vi.stubGlobal("Image", MockImage);
  installCanvasMock();
});

async function uploadImage(container: HTMLElement) {
  const user = userEvent.setup();
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["imgdata"], "cat.png", { type: "image/png" });
  await user.upload(input, file);
  await screen.findByAltText("Source image");
  return user;
}

describe("AsciiArt", () => {
  it("renders the upload prompt and controls", () => {
    render(<AsciiArt />);
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
    expect(
      screen.getByTestId("ascii-generate")
    ).toBeInTheDocument();
  });

  it("generates ASCII text from canvas getImageData after upload", async () => {
    const { container } = render(<AsciiArt />);
    const user = await uploadImage(container);

    await user.click(screen.getByTestId("ascii-generate"));

    const output = await screen.findByTestId("ascii-output");
    await waitFor(() => {
      expect(output.textContent && output.textContent.length).toBeGreaterThan(
        10
      );
    });
    // A horizontal gradient must produce more than one distinct character
    // (dark chars on the left, spaces on the right).
    const unique = new Set((output.textContent || "").replace(/\n/g, ""));
    expect(unique.size).toBeGreaterThan(1);

    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });

  it("copies the ASCII text to the clipboard", async () => {
    const { container } = render(<AsciiArt />);
    const user = await uploadImage(container);
    await user.click(screen.getByTestId("ascii-generate"));
    await screen.findByTestId("ascii-output");

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByTestId("ascii-copy"));

    await waitFor(() => expect(spy).toHaveBeenCalled());
    const arg = spy.mock.calls[0][0];
    expect(typeof arg).toBe("string");
    expect(arg.length).toBeGreaterThan(10);
  });

  it("downloads a .txt file of the ASCII output", async () => {
    const { container } = render(<AsciiArt />);
    const user = await uploadImage(container);
    await user.click(screen.getByTestId("ascii-generate"));
    await screen.findByTestId("ascii-output");

    const createSpy = vi.spyOn(URL, "createObjectURL");
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await user.click(screen.getByTestId("ascii-download-txt"));

    expect(createSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("exports the ASCII art as a PNG via canvas.toBlob", async () => {
    const { container } = render(<AsciiArt />);
    const user = await uploadImage(container);
    await user.click(screen.getByTestId("ascii-generate"));
    await screen.findByTestId("ascii-output");

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");

    await user.click(screen.getByTestId("ascii-download-png"));

    await waitFor(() => expect(toBlobSpy).toHaveBeenCalled());
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
