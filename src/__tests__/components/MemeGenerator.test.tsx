import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MemeGenerator from "@/components/MemeGenerator";

// happy-dom does not fire <img> load events; make src assignment resolve onload
// synchronously so the upload flow that seeds the default text boxes proceeds.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 100;
  height = 100;
  naturalWidth = 100;
  naturalHeight = 100;
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
    'input[type="file"]',
  ) as HTMLInputElement;
  const file = new File(["data"], "cat.jpg", { type: "image/jpeg" });
  await user.upload(input, file);
  // The canvas only renders once the image has loaded and boxes are seeded.
  await screen.findByTestId("meme-canvas");
  return user;
}

describe("MemeGenerator", () => {
  it("renders the upload prompt before an image is loaded", () => {
    render(<MemeGenerator />);
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
  });

  it("seeds the default top and bottom text boxes after upload", async () => {
    const { container } = render(<MemeGenerator />);
    await uploadImage(container);

    // Two default text inputs with the classic captions.
    const top = (await screen.findByTestId("text-input-0")) as HTMLInputElement;
    const bottom = screen.getByTestId("text-input-1") as HTMLInputElement;
    expect(top.value).toBe("TOP TEXT");
    expect(bottom.value).toBe("BOTTOM TEXT");
  });

  it("edits text-box content", async () => {
    const { container } = render(<MemeGenerator />);
    const user = await uploadImage(container);

    const top = (await screen.findByTestId("text-input-0")) as HTMLInputElement;
    await user.clear(top);
    await user.type(top, "Hello");
    expect(top.value).toBe("Hello");
  });

  it("adds and removes text boxes", async () => {
    const { container } = render(<MemeGenerator />);
    const user = await uploadImage(container);

    await screen.findByTestId("text-input-0");
    await user.click(screen.getByTestId("add-text-box"));
    expect(screen.getByTestId("text-input-2")).toBeInTheDocument();

    // Remove the first box; the list re-indexes so input-2 disappears.
    await user.click(screen.getByTestId("remove-text-0"));
    await waitFor(() =>
      expect(screen.queryByTestId("text-input-2")).not.toBeInTheDocument(),
    );
  });

  it("exposes font-size and stroke style controls for the selected box", async () => {
    const { container } = render(<MemeGenerator />);
    await uploadImage(container);

    await screen.findByTestId("text-input-0");
    // Style controls render once a box is selected (top box selected by default).
    expect(screen.getByTestId("text-color")).toBeInTheDocument();
    expect(screen.getAllByRole("slider").length).toBeGreaterThanOrEqual(2);
  });

  it("exports the meme as a PNG via canvas.toBlob and an object URL", async () => {
    const { container } = render(<MemeGenerator />);
    const user = await uploadImage(container);

    await screen.findByTestId("text-input-0");
    const downloadBtn = screen.getByRole("button", {
      name: /download meme/i,
    });
    await user.click(downloadBtn);

    await waitFor(() => {
      expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();
    });
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });
});
