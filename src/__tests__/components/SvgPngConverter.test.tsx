import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SvgPngConverter from "@/components/SvgPngConverter";

// happy-dom does not fire load events for <img>; make src assignment resolve
// onload synchronously so exportPng can proceed.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
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

const SAMPLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"></svg>';

describe("SvgPngConverter", () => {
  it("renders the title, dropzone, and export buttons", () => {
    render(<SvgPngConverter />);
    expect(
      screen.getByText(/svg .* png converter/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/drop svg here/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /export 1x/i })
    ).toBeInTheDocument();
  });

  it("disables export buttons until SVG markup is present", async () => {
    const user = userEvent.setup();
    render(<SvgPngConverter />);
    const exportBtn = screen.getByRole("button", { name: /export 2x/i });
    expect(exportBtn).toBeDisabled();

    const textarea = screen.getByPlaceholderText(/paste svg markup/i);
    await user.click(textarea);
    await user.paste(SAMPLE_SVG);
    expect(exportBtn).toBeEnabled();
  });

  it("exports a PNG via canvas when SVG is provided", async () => {
    const user = userEvent.setup();
    render(<SvgPngConverter />);
    const textarea = screen.getByPlaceholderText(/paste svg markup/i);
    await user.click(textarea);
    await user.paste(SAMPLE_SVG);

    const toDataUrlSpy = vi.spyOn(
      HTMLCanvasElement.prototype,
      "toDataURL"
    );
    await user.click(screen.getByRole("button", { name: /export 1x/i }));

    await waitFor(() =>
      expect(toDataUrlSpy).toHaveBeenCalledWith("image/png")
    );
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
