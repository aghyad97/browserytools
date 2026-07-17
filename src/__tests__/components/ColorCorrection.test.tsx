import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorCorrection from "@/components/ColorCorrection";

// happy-dom does not fire load events for <img>; resolve onload synchronously
// so the canvas pipeline (applyAdjustments) can proceed.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 20;
  height = 20;
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

async function uploadImage(name: string) {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["data"], name, { type: "image/jpeg" });
  await user.upload(input, file);
  await screen.findByText(name);
  return user;
}

describe("ColorCorrection", () => {
  it("renders the upload prompt with no Change control before any image loads", () => {
    render(<ColorCorrection />);
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /change/i })
    ).not.toBeInTheDocument();
  });

  it("shows the file name and a Change control once an image is loaded", async () => {
    render(<ColorCorrection />);
    await uploadImage("photo.jpg");
    expect(
      screen.getByRole("button", { name: /change/i })
    ).toBeInTheDocument();
    // Undo starts disabled — no adjustments made yet.
    expect(screen.getByTestId("cc-undo")).toBeDisabled();
  });

  it("swaps the image via Change and clears the stale adjustment history", async () => {
    render(<ColorCorrection />);
    const user = await uploadImage("photo.jpg");

    // Move the brightness slider to build up undo history for the first image.
    const brightnessSlider = screen.getAllByRole("slider")[0];
    brightnessSlider.focus();
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(screen.getByTestId("cc-undo")).toBeEnabled());

    // Swap to a new image via Change.
    await user.click(screen.getByRole("button", { name: /change/i }));
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const changeInput = fileInputs[fileInputs.length - 1] as HTMLInputElement;
    const secondFile = new File(["data2"], "portrait.png", {
      type: "image/png",
    });
    await user.upload(changeInput, secondFile);

    // File swapped in the info row.
    await screen.findByText("portrait.png");
    expect(screen.queryByText("photo.jpg")).not.toBeInTheDocument();

    // The previous image's undo history must not leak onto the new image —
    // otherwise "Undo" would silently restore adjustments belonging to a
    // photo that's no longer loaded.
    expect(screen.getByTestId("cc-undo")).toBeDisabled();
  });
});
