import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageResizer from "@/components/ImageResizer";

// happy-dom does not fire load events for <img>; resolve onload synchronously
// so the canvas pipeline (resize/crop/watermark) can proceed.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 200;
  height = 100;
  naturalWidth = 200;
  naturalHeight = 100;
  private _src = "";
  set src(value: string) {
    this._src = value;
    setTimeout(() => this.onload?.(), 0);
  }
  get src() {
    return this._src;
  }
}

beforeEach(() => {
  vi.stubGlobal("Image", MockImage);
});

async function uploadImage() {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
  await user.upload(input, file);
  // Tabs only render after an image loads.
  await screen.findByRole("tab", { name: /crop/i });
  return user;
}

describe("ImageResizer", () => {
  it("renders the upload prompt before any image", () => {
    render(<ImageResizer />);
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /crop/i })).not.toBeInTheDocument();
  });

  it("shows Resize, Crop and Watermark tabs after upload", async () => {
    render(<ImageResizer />);
    await uploadImage();
    expect(screen.getByRole("tab", { name: /resize/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /crop/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /watermark/i })).toBeInTheDocument();
  });

  it("resizes via canvas toBlob and creates an object URL", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("button", { name: /resize image/i }));
    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("shows crop aspect presets and an interactive crop box", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("tab", { name: /crop/i }));

    // Aspect presets present.
    expect(screen.getByRole("button", { name: /^free$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /1:1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /16:9/ })).toBeInTheDocument();

    // Crop box and drag handle render.
    expect(screen.getByTestId("crop-box")).toBeInTheDocument();
    expect(screen.getByTestId("crop-handle")).toBeInTheDocument();
  });

  it("crops via canvas toBlob and produces output", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("tab", { name: /crop/i }));
    await user.click(screen.getByRole("button", { name: /1:1/ }));
    await user.click(screen.getByRole("button", { name: /crop image/i }));

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled();
  });

  it("exposes a text watermark control and a 3x3 position grid", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("tab", { name: /watermark/i }));

    // Text content field is shown by default.
    expect(
      screen.getByPlaceholderText(/enter watermark text/i)
    ).toBeInTheDocument();

    // All 9 anchor buttons exist.
    expect(screen.getByTestId("anchor-top-left")).toBeInTheDocument();
    expect(screen.getByTestId("anchor-center")).toBeInTheDocument();
    expect(screen.getByTestId("anchor-bottom-right")).toBeInTheDocument();

    // Selecting an anchor toggles pressed state.
    const center = screen.getByTestId("anchor-center");
    await user.click(center);
    expect(center).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles tile mode and disables anchor selection while tiling", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("tab", { name: /watermark/i }));

    const tile = screen.getByRole("button", { name: /tile/i });
    expect(tile).toHaveAttribute("aria-pressed", "false");
    await user.click(tile);
    expect(tile).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("anchor-center")).toBeDisabled();
  });

  it("switches to image watermark mode and exposes a file input", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("tab", { name: /watermark/i }));
    await user.click(screen.getByRole("button", { name: /^image$/i }));
    expect(screen.getByTestId("watermark-file-input")).toBeInTheDocument();
  });

  it("composites a text watermark on canvas and exports", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("tab", { name: /watermark/i }));
    await user.click(screen.getByRole("button", { name: /apply watermark/i }));

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("shows a download button after a successful operation", async () => {
    render(<ImageResizer />);
    const user = await uploadImage();
    await user.click(screen.getByRole("button", { name: /resize image/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument()
    );
    // Before/after preview also appears.
    const after = within(screen.getByText(/result/i).closest("div")!);
    expect(after).toBeTruthy();
  });
});
