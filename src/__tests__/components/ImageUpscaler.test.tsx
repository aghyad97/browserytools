import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ImageUpscaler from "@/components/ImageUpscaler";

// Fake RawImage-like result returned by the upscaler pipeline.
const fakeUpscaled = {
  width: 200,
  height: 200,
  toBlob: vi
    .fn()
    .mockResolvedValue(new Blob(["mock"], { type: "image/png" })),
};
const upscaler = vi.fn().mockResolvedValue(fakeUpscaled);
const getPipeline = vi.fn().mockResolvedValue(upscaler);

// Mock the shared HF runner so tests never load a real model.
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

// Make HTMLImageElement.onload fire synchronously so the dropzone handler can
// read the source image's intrinsic dimensions in the test environment.
beforeEach(() => {
  getPipeline.mockClear();
  upscaler.mockClear();
  fakeUpscaled.toBlob.mockClear();

  Object.defineProperty(global.Image.prototype, "src", {
    configurable: true,
    set() {
      Object.defineProperty(this, "naturalWidth", {
        configurable: true,
        value: 100,
      });
      Object.defineProperty(this, "naturalHeight", {
        configurable: true,
        value: 100,
      });
      setTimeout(() => this.onload && this.onload(), 0);
    },
  });
});

function makeFile() {
  return new File(["img"], "photo.png", { type: "image/png" });
}

async function uploadImage() {
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { files: [makeFile()] } });
  // Wait for FileReader + Image onload to populate source state.
  await waitFor(() =>
    expect(
      (screen.getByTestId("upscale-button") as HTMLButtonElement).disabled
    ).toBe(false)
  );
}

describe("ImageUpscaler", () => {
  it("renders the dropzone and a disabled upscale button", () => {
    render(<ImageUpscaler />);
    expect(screen.getByTestId("upscale-button")).toBeDisabled();
    expect(screen.getByTestId("download-button")).toBeDisabled();
  });

  it("enables upscaling after an image is uploaded", async () => {
    render(<ImageUpscaler />);
    await uploadImage();
    expect(screen.getByTestId("upscale-button")).not.toBeDisabled();
  });

  it("upscales the image and shows the result + dimensions", async () => {
    render(<ImageUpscaler />);
    await uploadImage();

    fireEvent.click(screen.getByTestId("upscale-button"));

    await waitFor(() =>
      expect(screen.getByTestId("upscaled-image")).toBeInTheDocument()
    );

    expect(getPipeline).toHaveBeenCalledWith(
      "image-to-image",
      expect.any(String),
      expect.objectContaining({ device: "auto" })
    );
    expect(upscaler).toHaveBeenCalled();
    expect(fakeUpscaled.toBlob).toHaveBeenCalled();
    // Output dimensions from the fake RawImage are rendered.
    expect(screen.getByText("200×200")).toBeInTheDocument();
  });

  it("enables download after a successful upscale", async () => {
    render(<ImageUpscaler />);
    await uploadImage();
    fireEvent.click(screen.getByTestId("upscale-button"));
    await waitFor(() =>
      expect(screen.getByTestId("download-button")).not.toBeDisabled()
    );
  });

  it("shows an error toast when upscaling fails", async () => {
    const { toast } = await import("sonner");
    upscaler.mockRejectedValueOnce(new Error("boom"));
    render(<ImageUpscaler />);
    await uploadImage();
    fireEvent.click(screen.getByTestId("upscale-button"));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
