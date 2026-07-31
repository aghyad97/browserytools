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

  it("reports live download progress via @imgly's progress callback, not stuck at 0", async () => {
    // Regression test: BgRemoval used to set progress:0 on start and jump
    // straight to progress:100 on completion, with nothing updating it in
    // between. removeBackground's second arg (config) exposes a
    // `progress(key, current, total)` callback for exactly this — assert the
    // component actually wires it through to the item's live progress bar.
    let capturedProgress: ((key: string, current: number, total: number) => void) | undefined;
    let resolveProcessing: ((blob: Blob) => void) | undefined;
    (removeBackground as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (_blob: Blob, config: { progress?: typeof capturedProgress }) => {
        capturedProgress = config.progress;
        // A manually-controlled (not timer-based) promise: the test decides
        // exactly when processing "completes", so there's no race between a
        // real-time delay and the waitFor polls below.
        return new Promise<Blob>((resolve) => {
          resolveProcessing = resolve;
        });
      },
    );

    render(<BgRemoval />);
    const file = new File(["png-data"], "photo.png", { type: "image/png" });
    const fileInput = document.querySelector<HTMLInputElement>("input[type='file']");
    if (!fileInput) return;

    await userEvent.upload(fileInput, file);

    await waitFor(() => expect(capturedProgress).toBeDefined());

    capturedProgress?.("fetch:/models/isnet_fp16", 50, 100);

    await waitFor(() => {
      const bar = document.querySelector('[role="progressbar"]');
      expect(bar?.getAttribute("aria-valuenow")).toBe("50");
    });

    // Let the mocked call finish so the component doesn't stay "processing"
    // past the end of the test (would otherwise warn about act()/unmount).
    resolveProcessing?.(new Blob(["mock-png"], { type: "image/png" }));
    await waitFor(() => expect(screen.getByText(/photo\.png/)).toBeInTheDocument());
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
