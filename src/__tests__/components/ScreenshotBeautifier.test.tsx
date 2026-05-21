import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScreenshotBeautifier from "@/components/ScreenshotBeautifier";

// happy-dom does not fire load events for <img>; make src assignment resolve
// onload synchronously so the dropzone preview and canvas render path proceed.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 800;
  height = 600;
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

async function uploadScreenshot() {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  const file = new File(["data"], "shot.png", { type: "image/png" });
  await user.upload(input, file);
  // Canvas appears once the image has loaded.
  await screen.findByTestId("beautifier-canvas");
  return user;
}

describe("ScreenshotBeautifier", () => {
  it("renders the upload prompt initially", () => {
    render(<ScreenshotBeautifier />);
    expect(screen.getByText(/drop your screenshot here/i)).toBeInTheDocument();
  });

  it("shows the canvas and controls after uploading a screenshot", async () => {
    render(<ScreenshotBeautifier />);
    await uploadScreenshot();

    expect(screen.getByTestId("beautifier-canvas")).toBeInTheDocument();
    // Control labels from the i18n namespace.
    expect(screen.getByText(/^Padding$/)).toBeInTheDocument();
    expect(screen.getByText(/Corner Radius/)).toBeInTheDocument();
    expect(screen.getByText(/macOS Window Frame/)).toBeInTheDocument();
    expect(screen.getByText(/Output Aspect Ratio/)).toBeInTheDocument();
  });

  it("exports a PNG via canvas.toBlob and createObjectURL on download", async () => {
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    render(<ScreenshotBeautifier />);
    const user = await uploadScreenshot();

    await user.click(screen.getByRole("button", { name: /download png/i }));

    await waitFor(() => expect(toBlobSpy).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();
    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it("lets the user switch the background to a solid color", async () => {
    render(<ScreenshotBeautifier />);
    const user = await uploadScreenshot();

    // The first combobox is the background-mode Select.
    const selects = screen.getAllByRole("combobox");
    await user.click(selects[0]);
    await user.click(screen.getByRole("option", { name: /solid color/i }));

    expect(
      screen.getByLabelText(/background color/i),
    ).toBeInTheDocument();
  });
});
