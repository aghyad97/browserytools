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

// Spy on the draw call while keeping the real geometry, so the preview tests
// can assert what it was handed (ANCHORS et al. must stay real — the component
// renders its anchor grid from them).
vi.mock("@/lib/image/watermark-draw", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/image/watermark-draw")>();
  return { ...actual, drawWatermark: vi.fn(actual.drawWatermark) };
});

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

  // The preview exists so the mark can be judged before it is committed, which
  // only holds if it matches the export. drawWatermark is handed the FULL-RES
  // dimensions under a scaled context — passing the preview's own size would
  // shrink the canvas but not the font, drifting from what downloads.
  it("previews the composite at export geometry as soon as an image loads", async () => {
    const user = userEvent.setup();
    const { drawWatermark } = await import("@/lib/image/watermark-draw");
    render(<WatermarkImage />);
    await uploadImage(user);

    const preview = await screen.findByTestId("watermark-preview");
    expect(preview).toBeInTheDocument();

    // Drawn without anyone pressing "apply".
    await waitFor(() => expect(drawWatermark).toHaveBeenCalled());
    const [, canvasW, canvasH] = vi.mocked(drawWatermark).mock.calls.at(-1)!;
    expect({ canvasW, canvasH }).toEqual({ canvasW: 200, canvasH: 100 });
  });

  it("redraws the preview when a control changes, before any apply", async () => {
    const user = userEvent.setup();
    const { drawWatermark } = await import("@/lib/image/watermark-draw");
    render(<WatermarkImage />);
    await uploadImage(user);
    await waitFor(() => expect(drawWatermark).toHaveBeenCalled());

    vi.mocked(drawWatermark).mockClear();
    await user.click(screen.getByTestId("anchor-top-left"));

    await waitFor(() => expect(drawWatermark).toHaveBeenCalled());
    expect(vi.mocked(drawWatermark).mock.calls.at(-1)![3]).toMatchObject({
      anchor: "top-left",
    });
  });

  it("switches to image watermark mode and exposes a file input", async () => {
    const user = userEvent.setup();
    render(<WatermarkImage />);
    await uploadImage(user);

    await user.click(screen.getByRole("button", { name: /^image$/i }));
    expect(screen.getByTestId("watermark-file-input")).toBeInTheDocument();
  });
});
