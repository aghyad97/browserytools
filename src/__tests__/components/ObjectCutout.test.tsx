import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the SAM helper so NO real model is downloaded. The mocked segment()
// returns a tiny binary mask sized to the (mocked) image.
const segmentMock = vi.fn(async () => ({
  data: new Uint8Array([1, 1, 1, 1]),
  width: 2,
  height: 2,
}));

vi.mock("@/lib/sam-segment", () => ({
  segment: (...args: unknown[]) => segmentMock(...(args as [])),
}));

vi.mock("@/lib/hf-pipeline", () => ({
  hasWebGPU: () => false,
}));

import ObjectCutout from "@/components/ObjectCutout";

// happy-dom's HTMLImageElement does not fire onload from a data URL on its own,
// so make setting `src` synchronously trigger onload with a known size.
beforeEach(() => {
  segmentMock.mockClear();
  Object.defineProperty(HTMLImageElement.prototype, "src", {
    configurable: true,
    set(value: string) {
      this._src = value;
      Object.defineProperty(this, "naturalWidth", {
        configurable: true,
        value: 2,
      });
      Object.defineProperty(this, "naturalHeight", {
        configurable: true,
        value: 2,
      });
      setTimeout(() => this.onload && this.onload(), 0);
    },
    get() {
      return this._src;
    },
  });
});

async function uploadImage() {
  const file = new File(["png-data"], "photo.png", { type: "image/png" });
  const input = document.querySelector<HTMLInputElement>("input[type='file']");
  expect(input).not.toBeNull();
  await userEvent.upload(input as HTMLInputElement, file);
}

describe("ObjectCutout", () => {
  it("renders the upload dropzone", () => {
    render(<ObjectCutout />);
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
  });

  it("shows the canvas after an image is uploaded and adds a point on click", async () => {
    render(<ObjectCutout />);
    await uploadImage();

    const canvas = await screen.findByTestId("cutout-canvas");
    expect(canvas).toBeInTheDocument();
    // No points yet.
    expect(screen.getByText(/0 point/i)).toBeInTheDocument();

    fireEvent.click(canvas, { clientX: 1, clientY: 1 });
    await waitFor(() =>
      expect(screen.getByText(/1 point/i)).toBeInTheDocument()
    );
  });

  it("runs the cutout + export (toBlob) path after a point is added", async () => {
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    render(<ObjectCutout />);
    await uploadImage();

    const canvas = await screen.findByTestId("cutout-canvas");
    fireEvent.click(canvas, { clientX: 1, clientY: 1 });

    const cutBtn = await screen.findByRole("button", { name: /cut out object/i });
    await userEvent.click(cutBtn);

    await waitFor(() => expect(segmentMock).toHaveBeenCalled());
    await waitFor(() => expect(toBlobSpy).toHaveBeenCalled());
  });
});
