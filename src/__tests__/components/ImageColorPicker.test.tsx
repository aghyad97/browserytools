import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageColorPicker from "@/components/ImageColorPicker";

// happy-dom does not fire <img> load events; resolve onload after src is set
// so drawImageToCanvas runs.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 20;
  height = 20;
  private _src = "";
  set src(value: string) {
    this._src = value;
    setTimeout(() => this.onload?.(), 0);
  }
  get src() {
    return this._src;
  }
}

// A solid red pixel buffer the canvas mock will return from getImageData.
function redData(pixels: number) {
  const arr = new Uint8ClampedArray(pixels * 4);
  for (let i = 0; i < pixels; i++) {
    arr[i * 4] = 255; // r
    arr[i * 4 + 1] = 0; // g
    arr[i * 4 + 2] = 0; // b
    arr[i * 4 + 3] = 255; // a
  }
  return { data: arr };
}

const getImageData = vi.fn((_x: number, _y: number, w: number, h: number) =>
  redData(Math.max(1, w) * Math.max(1, h)),
);

beforeEach(() => {
  vi.stubGlobal("Image", MockImage);
  getImageData.mockClear();
  // Override the shared canvas mock so getImageData returns real red pixels and
  // getBoundingClientRect lets eventToPixel resolve a coordinate.
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData,
    clearRect: vi.fn(),
    imageSmoothingEnabled: false,
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
    left: 0,
    top: 0,
    width: 20,
    height: 20,
    right: 20,
    bottom: 20,
    x: 0,
    y: 0,
    toJSON: () => "",
  })) as unknown as typeof HTMLCanvasElement.prototype.getBoundingClientRect;
});

async function uploadImage() {
  const user = userEvent.setup();
  const input = screen.getByTestId("image-input") as HTMLInputElement;
  const file = new File(["data"], "photo.png", { type: "image/png" });
  await user.upload(input, file);
  // Canvas appears once the image loads onto it; wait for the palette too so the
  // async draw effect has fully settled before we interact with the canvas.
  await screen.findByTestId("picker-canvas");
  await screen.findByText(/dominant colors/i);
  return user;
}

describe("ImageColorPicker", () => {
  it("renders the upload prompt", () => {
    render(<ImageColorPicker />);
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
  });

  it("renders the image on a canvas after upload and extracts a palette", async () => {
    render(<ImageColorPicker />);
    await uploadImage();
    // Palette extraction calls getImageData on the full canvas.
    await waitFor(() => expect(getImageData).toHaveBeenCalled());
    expect(screen.getByText(/dominant colors/i)).toBeInTheDocument();
  });

  it("reads canvas getImageData on click and shows HEX/RGB/HSL", async () => {
    render(<ImageColorPicker />);
    await uploadImage();
    const canvas = screen.getByTestId("picker-canvas");

    fireEvent.click(canvas, { clientX: 5, clientY: 5 });

    // Picking a red pixel must surface #FF0000 / rgb(255, 0, 0).
    await waitFor(() =>
      expect(screen.getByTestId("value-hex")).toHaveTextContent("#FF0000"),
    );
    expect(screen.getByTestId("value-rgb")).toHaveTextContent(
      "rgb(255, 0, 0)",
    );
    expect(screen.getByTestId("value-hsl")).toHaveTextContent(
      "hsl(0, 100%, 50%)",
    );
  });

  it("copies the picked HEX value to the clipboard", async () => {
    render(<ImageColorPicker />);
    const user = await uploadImage();
    const canvas = screen.getByTestId("picker-canvas");
    fireEvent.click(canvas, { clientX: 5, clientY: 5 });
    await screen.findByTestId("value-hex");

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy hex/i }));

    expect(spy).toHaveBeenCalledWith("#FF0000");
  });
});
