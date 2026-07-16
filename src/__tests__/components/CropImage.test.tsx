import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CropImage from "@/components/CropImage";
import { downloadUrl } from "@/lib/download";

// Drive the real flow: drop image → crop overlay → crop → download via lib/download.
vi.mock("@/lib/download", () => ({
  downloadUrl: vi.fn(),
  downloadBlob: vi.fn(),
  downloadDataUrl: vi.fn(),
  downloadText: vi.fn(),
}));

// happy-dom does not fire <img> load events; resolve onload so the canvas
// crop pipeline can proceed.
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

async function uploadImage(user: ReturnType<typeof userEvent.setup>) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
  await user.upload(input, file);
  // Crop UI only renders after an image loads.
  await screen.findByTestId("crop-area");
}

describe("CropImage", () => {
  it("renders inside the shell with a single h1 and an upload prompt", () => {
    render(<CropImage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
  });

  it("shows the crop overlay, handle and aspect presets after upload", async () => {
    const user = userEvent.setup();
    render(<CropImage />);
    await uploadImage(user);

    expect(screen.getByTestId("crop-area")).toBeInTheDocument();
    expect(screen.getByTestId("crop-box")).toBeInTheDocument();
    expect(screen.getByTestId("crop-handle")).toBeInTheDocument();

    // Aspect presets.
    expect(screen.getByRole("button", { name: /^free$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /1:1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /16:9/ })).toBeInTheDocument();
  });

  it("crops via canvas and downloads through lib/download", async () => {
    const user = userEvent.setup();
    render(<CropImage />);
    await uploadImage(user);

    await user.click(screen.getByRole("button", { name: /1:1/ }));
    await user.click(screen.getByRole("button", { name: /crop image/i }));

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled();

    // Primary action (Download) is enabled after a crop and routes through lib/download.
    const primary = screen.getByTestId("tool-shell-primary");
    await waitFor(() => expect(primary).toBeEnabled());
    await user.click(primary);
    expect(downloadUrl).toHaveBeenCalledWith(
      expect.any(String),
      "photo_cropped.jpg"
    );
  });
});
