import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoCollage from "@/components/PhotoCollage";

// happy-dom does not load <img>; make src assignment fire onload synchronously
// so the component's image-decode bookkeeping completes.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 100;
  naturalHeight = 100;
  width = 100;
  height = 100;
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

async function uploadPhotos(container: HTMLElement, count: number) {
  const user = userEvent.setup();
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const files = Array.from(
    { length: count },
    (_, i) => new File(["data"], `photo${i}.jpg`, { type: "image/jpeg" })
  );
  await user.upload(input, files);
  // Wait until thumbnails for the uploaded photos appear.
  await waitFor(() =>
    expect(screen.getAllByTestId("collage-thumb")).toHaveLength(count)
  );
  return user;
}

describe("PhotoCollage", () => {
  it("renders the upload prompt and the layout/aspect controls", () => {
    render(<PhotoCollage />);
    expect(screen.getByText(/drop your photos here/i)).toBeInTheDocument();
    // Layout, aspect, and format selects are present.
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(3);
    // Export is disabled until photos are added.
    expect(screen.getByTestId("export-btn")).toBeDisabled();
  });

  it("adds uploaded photos as reorderable thumbnails and enables export", async () => {
    const { container } = render(<PhotoCollage />);
    await uploadPhotos(container, 3);

    expect(screen.getByText(/photos \(3\)/i)).toBeInTheDocument();
    expect(screen.getByTestId("export-btn")).not.toBeDisabled();
    // Live preview canvas is mounted once photos exist.
    expect(screen.getByTestId("collage-canvas")).toBeInTheDocument();
  });

  it("exports the collage via canvas.toBlob and createObjectURL on download", async () => {
    const { container } = render(<PhotoCollage />);
    const user = await uploadPhotos(container, 2);

    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");

    await user.click(screen.getByTestId("export-btn"));

    await waitFor(() => expect(toBlobSpy).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it("can change the layout template", async () => {
    const { container } = render(<PhotoCollage />);
    const user = await uploadPhotos(container, 1);

    // First combobox is the layout select.
    const layoutSelect = screen.getAllByRole("combobox")[0];
    await user.click(layoutSelect);
    await user.click(screen.getByRole("option", { name: /mosaic/i }));

    // Selecting a new layout keeps the export available.
    expect(screen.getByTestId("export-btn")).not.toBeDisabled();
  });
});
