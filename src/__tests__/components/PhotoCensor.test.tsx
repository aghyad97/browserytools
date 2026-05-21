import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoCensor from "@/components/PhotoCensor";

// happy-dom does not fire load events for <img>; make src assignment resolve
// onload asynchronously so the source canvas + visible canvas mount.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 20;
  height = 20;
  naturalWidth = 20;
  naturalHeight = 20;
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

async function uploadImage(container: HTMLElement) {
  const user = userEvent.setup();
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["data"], "secret.png", { type: "image/png" });
  await user.upload(input, file);
  // Canvas appears only once the image has loaded into the backing canvas.
  await screen.findByTestId("censor-canvas");
  return user;
}

// Draw a rectangular region on the canvas via pointer events.
function drawRegion(canvas: HTMLCanvasElement) {
  canvas.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 20, height: 20 } as DOMRect);
  canvas.dispatchEvent(
    new MouseEvent("pointerdown", { clientX: 2, clientY: 2, bubbles: true })
  );
  canvas.dispatchEvent(
    new MouseEvent("pointermove", { clientX: 15, clientY: 15, bubbles: true })
  );
  canvas.dispatchEvent(
    new MouseEvent("pointerup", { clientX: 15, clientY: 15, bubbles: true })
  );
}

describe("PhotoCensor", () => {
  it("renders the upload prompt before an image is loaded", () => {
    render(<PhotoCensor />);
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
  });

  it("shows the canvas and censor controls after upload", async () => {
    const { container } = render(<PhotoCensor />);
    await uploadImage(container);

    expect(screen.getByTestId("censor-canvas")).toBeInTheDocument();
    // Censor mode + export format selects.
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/censor mode/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
    // Privacy / in-browser note must be present.
    expect(screen.getByText(/never uploaded/i)).toBeInTheDocument();
  });

  it("blocks export until a region is drawn", async () => {
    const { container } = render(<PhotoCensor />);
    const user = await uploadImage(container);

    const downloadBtn = screen.getByRole("button", { name: /download/i });
    expect(downloadBtn).toBeDisabled();
    void user;
  });

  it("exports via canvas.toBlob and createObjectURL after drawing a region", async () => {
    const { container } = render(<PhotoCensor />);
    const user = await uploadImage(container);

    const canvas = screen.getByTestId("censor-canvas") as HTMLCanvasElement;
    drawRegion(canvas);

    const downloadBtn = await screen.findByRole("button", { name: /download/i });
    await waitFor(() => expect(downloadBtn).not.toBeDisabled());

    await user.click(downloadBtn);

    await waitFor(() =>
      expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled()
    );
    expect(URL.createObjectURL).toHaveBeenCalled();
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });
});
