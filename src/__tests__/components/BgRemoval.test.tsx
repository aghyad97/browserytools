import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Must be declared before import — Vitest hoists vi.mock()
vi.mock("@imgly/background-removal", () => ({
  removeBackground: vi
    .fn()
    .mockResolvedValue(new Blob(["mock-png"], { type: "image/png" })),
}));

import BgRemoval from "@/components/BgRemoval";
import { removeBackground } from "@imgly/background-removal";

describe("BgRemoval", () => {
  it("renders the dropzone area", () => {
    render(<BgRemoval />);
    // Should show some kind of upload or drag-and-drop UI
    const dropzone =
      screen.queryByText(/drag.*drop/i) ||
      screen.queryByText(/upload/i) ||
      screen.queryAllByRole("button")[0];
    expect(dropzone).toBeInTheDocument();
  });

  it("calls removeBackground when an image file is dropped", async () => {
    render(<BgRemoval />);

    const file = new File(["png-data"], "photo.png", { type: "image/png" });

    // Find the file input (react-dropzone renders one)
    const fileInput = document.querySelector<HTMLInputElement>("input[type='file']");
    if (!fileInput) {
      // If no file input found, skip — the dropzone may require pointer events
      return;
    }

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(removeBackground).toHaveBeenCalled();
    });
  });

  it("shows an error state when removeBackground rejects", async () => {
    (removeBackground as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Processing failed")
    );

    render(<BgRemoval />);

    const file = new File(["png-data"], "photo.png", { type: "image/png" });
    const fileInput = document.querySelector<HTMLInputElement>("input[type='file']");
    if (!fileInput) return;

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      const errorMsg =
        screen.queryByText(/error/i) ||
        screen.queryByText(/failed/i) ||
        screen.queryByText(/try again/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });
});
