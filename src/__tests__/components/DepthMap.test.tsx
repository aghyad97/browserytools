import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Fake single-channel depth RawImage returned by the mocked pipeline.
const fakeDepth = {
  data: new Uint8Array([0, 64, 128, 255]),
  width: 2,
  height: 2,
  channels: 1,
};

const estimator = vi.fn().mockResolvedValue({ depth: fakeDepth });
const getPipeline = vi.fn().mockResolvedValue(estimator);

// Mock the shared HF loader so no real model is fetched.
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

import DepthMap from "@/components/DepthMap";

beforeEach(() => {
  estimator.mockClear();
  getPipeline.mockClear();
  estimator.mockResolvedValue({ depth: fakeDepth });
});

async function uploadImage() {
  const file = new File(["png-data"], "photo.png", { type: "image/png" });
  const input = document.querySelector<HTMLInputElement>("input[type='file']");
  expect(input).toBeTruthy();
  await userEvent.upload(input as HTMLInputElement, file);
}

describe("DepthMap", () => {
  it("renders the upload dropzone", () => {
    render(<DepthMap />);
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
  });

  it("uploads an image, generates a depth map, then downloads a PNG", async () => {
    render(<DepthMap />);

    const generateBtn = screen.getByTestId("generate-btn");
    const downloadBtn = screen.getByTestId("download-btn");
    // Both disabled before an image is loaded.
    expect(generateBtn).toBeDisabled();
    expect(downloadBtn).toBeDisabled();

    await uploadImage();

    await waitFor(() => expect(generateBtn).not.toBeDisabled());

    await userEvent.click(generateBtn);

    // The depth-estimation pipeline was requested with the right task.
    await waitFor(() =>
      expect(getPipeline).toHaveBeenCalledWith(
        "depth-estimation",
        expect.any(String),
        expect.objectContaining({ device: "auto" })
      )
    );
    await waitFor(() => expect(estimator).toHaveBeenCalled());

    // Download becomes available once a result exists.
    await waitFor(() => expect(downloadBtn).not.toBeDisabled());

    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    await userEvent.click(downloadBtn);

    await waitFor(() => expect(toBlobSpy).toHaveBeenCalled());
    toBlobSpy.mockRestore();
  });

  it("shows an error toast when the estimator rejects", async () => {
    const { toast } = await import("sonner");
    estimator.mockRejectedValueOnce(new Error("boom"));

    render(<DepthMap />);
    await uploadImage();

    const generateBtn = screen.getByTestId("generate-btn");
    await waitFor(() => expect(generateBtn).not.toBeDisabled());
    await userEvent.click(generateBtn);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
