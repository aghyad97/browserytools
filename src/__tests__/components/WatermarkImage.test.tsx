import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WatermarkImage from "@/components/WatermarkImage";
import { downloadUrl } from "@/lib/download";

// Drive the real flow: drop image → watermark controls → apply → download.
vi.mock("@/lib/download", () => ({
  downloadUrl: vi.fn(),
  downloadBlob: vi.fn(),
  downloadDataUrl: vi.fn(),
  downloadText: vi.fn(),
}));

// happy-dom does not fire <img> load events; resolve onload so the canvas
// watermark pipeline can proceed.
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
  // Watermark controls only render after an image loads.
  await screen.findByTestId("anchor-center");
}

describe("WatermarkImage", () => {
  it("renders inside the shell with a single h1 and an upload prompt", () => {
    render(<WatermarkImage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
  });

  it("shows the watermark controls, 3x3 anchor grid and sliders after upload", async () => {
    const user = userEvent.setup();
    render(<WatermarkImage />);
    await uploadImage(user);

    // Text content field is shown by default.
    expect(
      screen.getByPlaceholderText(/enter watermark text/i)
    ).toBeInTheDocument();

    // All nine anchor buttons render.
    expect(screen.getByTestId("anchor-top-left")).toBeInTheDocument();
    expect(screen.getByTestId("anchor-center")).toBeInTheDocument();
    expect(screen.getByTestId("anchor-bottom-right")).toBeInTheDocument();

    // Sliders + tile toggle.
    expect(screen.getAllByText(/opacity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/scale/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/rotation/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /tile/i })
    ).toBeInTheDocument();
  });

  it("selecting an anchor toggles its pressed state", async () => {
    const user = userEvent.setup();
    render(<WatermarkImage />);
    await uploadImage(user);

    const center = screen.getByTestId("anchor-center");
    await user.click(center);
    expect(center).toHaveAttribute("aria-pressed", "true");
  });

  it("composites a text watermark on canvas and downloads a PNG", async () => {
    const user = userEvent.setup();
    render(<WatermarkImage />);
    await uploadImage(user);

    await user.click(screen.getByRole("button", { name: /apply watermark/i }));

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled();

    const primary = screen.getByTestId("tool-shell-primary");
    await waitFor(() => expect(primary).toBeEnabled());
    await user.click(primary);
    expect(downloadUrl).toHaveBeenCalledWith(
      expect.any(String),
      "photo_watermarked.png"
    );
  });

  it("switches to image watermark mode and exposes a file input", async () => {
    const user = userEvent.setup();
    render(<WatermarkImage />);
    await uploadImage(user);

    await user.click(screen.getByRole("button", { name: /^image$/i }));
    expect(screen.getByTestId("watermark-file-input")).toBeInTheDocument();
  });
});
