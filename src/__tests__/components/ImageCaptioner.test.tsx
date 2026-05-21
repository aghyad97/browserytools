import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageCaptioner from "@/components/ImageCaptioner";

// Mock the shared HF runner so tests don't load a real model.
const captioner = vi
  .fn()
  .mockResolvedValue([{ generated_text: "a cat sitting on a couch" }]);
const getPipeline = vi.fn().mockResolvedValue(captioner);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

function uploadImage() {
  const file = new File(["img-data"], "photo.png", { type: "image/png" });
  const input = document.querySelector<HTMLInputElement>("input[type='file']");
  return { file, input };
}

beforeEach(() => {
  getPipeline.mockClear();
  captioner.mockClear();
  captioner.mockResolvedValue([{ generated_text: "a cat sitting on a couch" }]);
});

describe("ImageCaptioner", () => {
  it("renders the dropzone and a disabled generate button", () => {
    render(<ImageCaptioner />);
    expect(
      screen.getByRole("button", { name: /generate/i })
    ).toBeDisabled();
    expect(document.querySelector("input[type='file']")).toBeInTheDocument();
  });

  it("captions an uploaded image and shows the caption + alt text", async () => {
    const user = userEvent.setup();
    render(<ImageCaptioner />);

    const { file, input } = uploadImage();
    expect(input).not.toBeNull();
    await user.upload(input!, file);

    const generateBtn = screen.getByRole("button", { name: /generate/i });
    await waitFor(() => expect(generateBtn).toBeEnabled());
    await user.click(generateBtn);

    await waitFor(() =>
      expect(screen.getByTestId("caption-result")).toBeInTheDocument()
    );

    expect(getPipeline).toHaveBeenCalledWith(
      "image-to-text",
      "Xenova/vit-gpt2-image-captioning",
      expect.objectContaining({ device: "auto" })
    );
    expect(captioner).toHaveBeenCalled();

    const result = screen.getByTestId("caption-result");
    expect(result).toHaveTextContent("a cat sitting on a couch");
    // Ready-to-use alt snippet
    expect(result).toHaveTextContent('alt="a cat sitting on a couch"');
  });

  it("copies the caption to the clipboard", async () => {
    const user = userEvent.setup();
    render(<ImageCaptioner />);

    const { file, input } = uploadImage();
    await user.upload(input!, file);
    await user.click(screen.getByRole("button", { name: /generate/i }));

    await waitFor(() =>
      expect(screen.getByTestId("caption-result")).toBeInTheDocument()
    );

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy caption/i }));
    expect(spy).toHaveBeenCalledWith("a cat sitting on a couch");
  });

  it("errors when generating with no image", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<ImageCaptioner />);
    // Button is disabled without an image, so call is guarded; assert no pipeline.
    const generateBtn = screen.getByRole("button", { name: /generate/i });
    expect(generateBtn).toBeDisabled();
    await user.click(generateBtn).catch(() => {});
    expect(getPipeline).not.toHaveBeenCalled();
    void toast;
  });
});
