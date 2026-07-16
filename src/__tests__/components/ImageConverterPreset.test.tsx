import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageConverter from "@/components/ImageConverter";

// HEIC decoding runs through heic2any (a heavy browser-only lib). Mock it so the
// ingest branch is exercised without the real decoder, and so we can assert the
// intermediate format the component requests.
const heic2any = vi.fn().mockResolvedValue(new Blob(["png-bytes"], { type: "image/png" }));
vi.mock("heic2any", () => ({
  default: (...args: unknown[]) => heic2any(...args),
}));

// AVIF encoder is mocked elsewhere too; keep it inert here so no WASM loads.
vi.mock("@jsquash/avif/encode", () => ({
  default: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
}));

// happy-dom does not fire <img> load events; resolve onload so any downstream
// canvas work can proceed.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 10;
  height = 10;
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
  heic2any.mockClear();
});

describe("ImageConverter presets (HEIC landing pages)", () => {
  it("locks the format and shows the HEIC drop hint when preset-driven", () => {
    render(
      <ImageConverter
        preset={{ targetFormat: "image/png", lockFormat: true, heicEmphasis: true }}
      />,
    );

    // lockFormat hides the target-format Select entirely.
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    // heicEmphasis swaps the dropzone subtitle to the HEIC-specific hint.
    expect(screen.getByText(/drop iphone heic photos/i)).toBeInTheDocument();
  });

  it("keeps the default target-format Select when no preset is supplied", () => {
    render(<ImageConverter />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("decodes dropped HEIC via a lossless PNG intermediate", async () => {
    const user = userEvent.setup();
    render(
      <ImageConverter preset={{ targetFormat: "image/jpeg", heicEmphasis: true }} />,
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["heic-bytes"], "IMG_0001.heic", { type: "image/heic" });
    await user.upload(input, file);

    // The intermediate must be lossless PNG (was JPEG before Task 5).
    await vi.waitFor(() =>
      expect(heic2any).toHaveBeenCalledWith(
        expect.objectContaining({ toType: "image/png" }),
      ),
    );
    // Preview appears once the decoded blob is read.
    await screen.findByAltText("Original");
  });
});
