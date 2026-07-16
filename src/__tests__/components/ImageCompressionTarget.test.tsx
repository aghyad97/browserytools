import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageCompression from "@/components/ImageCompression";
import { compressToTargetSize } from "@/lib/image/target-size";

// Target-size mode: the component delegates the search to the injectable
// engine (Task 1). Mock it so the flow is deterministic and we can assert the
// byte budget wiring (targetKb * 1024).
vi.mock("@/lib/image/target-size", () => ({
  compressToTargetSize: vi.fn(async () => ({
    blob: new Blob(["compressed"], { type: "image/jpeg" }),
    width: 120,
    height: 60,
    quality: 0.62,
    iterations: 4,
    hitTarget: true,
  })),
}));

vi.mock("@/lib/download", () => ({
  downloadDataUrl: vi.fn(),
  downloadBlob: vi.fn(),
  downloadUrl: vi.fn(),
  downloadText: vi.fn(),
}));

// happy-dom does not fire <img> load events; resolve onload so loadImage()
// and the target pipeline can proceed.
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
  vi.clearAllMocks();
  vi.stubGlobal("Image", MockImage);
});

async function uploadImage(user: ReturnType<typeof userEvent.setup>) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(["data"], "photo.png", { type: "image/png" });
  await user.upload(input, file);
}

describe("ImageCompression — target size mode", () => {
  it("initialises from a target preset: shows the KB input and preset chips", () => {
    render(<ImageCompression preset={{ mode: "target", targetKb: 20 }} />);

    // Numeric target input reflects the preset value.
    const kb = screen.getByTestId("target-size-input") as HTMLInputElement;
    expect(kb).toHaveValue(20);

    // Preset chips present (aria label per presetChipAria).
    expect(
      screen.getByRole("button", { name: /set target to 20 KB/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /set target to 1 MB/i }),
    ).toBeInTheDocument();
  });

  it("hides the quality / max-width sliders in target mode", async () => {
    const user = userEvent.setup();
    render(<ImageCompression preset={{ mode: "target", targetKb: 100 }} />);

    // Advanced tab holds the quality + max-width sliders in the normal modes;
    // target mode suppresses them, so the tab exposes no slider.
    await user.click(screen.getByRole("tab", { name: /advanced/i }));
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("coerces a PNG preset format to JPEG and warns", () => {
    render(
      <ImageCompression
        preset={{ mode: "target", targetKb: 50, format: "image/png" }}
      />,
    );
    expect(
      screen.getByText(/PNG can't be size-targeted/i),
    ).toBeInTheDocument();
  });

  it("compresses via the engine with targetBytes = targetKb * 1024", async () => {
    const user = userEvent.setup();
    render(<ImageCompression preset={{ mode: "target", targetKb: 20 }} />);

    await uploadImage(user);
    const compress = await screen.findByRole("button", {
      name: /compress image/i,
    });
    await waitFor(() => expect(compress).toBeEnabled());
    await user.click(compress);

    await waitFor(() =>
      expect(compressToTargetSize).toHaveBeenCalledWith(
        expect.objectContaining({ targetBytes: 20 * 1024 }),
      ),
    );
  });
});
