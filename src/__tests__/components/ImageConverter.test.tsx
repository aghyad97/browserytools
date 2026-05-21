import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageConverter from "@/components/ImageConverter";

// Real AVIF encoding happens through the WASM encoder (browsers cannot encode
// AVIF via canvas). Mock it so the conversion path is exercised without WASM.
const avifEncode = vi.fn().mockResolvedValue(new ArrayBuffer(8));
vi.mock("@jsquash/avif/encode", () => ({
  default: (...args: unknown[]) => avifEncode(...args),
}));

// happy-dom does not fire load events for <img>; make src assignment resolve
// onload synchronously so handleConvert can proceed.
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
  avifEncode.mockClear();
});

async function uploadImage(container: HTMLElement) {
  const user = userEvent.setup();
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
  await user.upload(input, file);
  // Wait until the original-image preview appears.
  await screen.findByAltText("Original");
  return user;
}

describe("ImageConverter", () => {
  it("renders the upload prompt and target-format selector", () => {
    render(<ImageConverter />);
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  // Issue #14: AVIF must be produced by the real encoder, not canvas (which
  // silently falls back to PNG and yields a huge mislabeled file).
  it("uses the WASM AVIF encoder when converting to AVIF", async () => {
    const { container } = render(<ImageConverter />);
    const user = await uploadImage(container);

    // Pick AVIF in the format Select.
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /avif/i }));

    await user.click(screen.getByRole("button", { name: /convert/i }));

    await waitFor(() => expect(avifEncode).toHaveBeenCalledTimes(1));
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });

  // The canvas toBlob mock always returns image/png; converting to JPEG must
  // therefore be detected as an unsupported-format mismatch and fail loudly
  // instead of silently producing a mislabeled file.
  it("fails loudly when the browser cannot encode the requested format", async () => {
    const { container } = render(<ImageConverter />);
    const user = await uploadImage(container);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /jpeg/i }));

    await user.click(screen.getByRole("button", { name: /convert/i }));

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(avifEncode).not.toHaveBeenCalled();
  });

  it("succeeds for PNG (the format the canvas mock returns)", async () => {
    const { container } = render(<ImageConverter />);
    const user = await uploadImage(container);

    // PNG is the default target format.
    await user.click(screen.getByRole("button", { name: /convert/i }));

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
