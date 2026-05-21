import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OgImageGenerator from "@/components/OgImageGenerator";

// happy-dom does not fire <img> load events; resolve onload synchronously so
// uploaded-logo handling can proceed.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 64;
  height = 64;
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

describe("OgImageGenerator", () => {
  it("renders the title/subtitle inputs and the canvas preview", () => {
    render(<OgImageGenerator />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtitle / Description")).toBeInTheDocument();
    expect(screen.getByTestId("og-canvas")).toBeInTheDocument();
  });

  it("lets the user fill the title and choose a template", async () => {
    const user = userEvent.setup();
    render(<OgImageGenerator />);

    const titleInput = screen.getByLabelText("Title");
    await user.clear(titleInput);
    await user.type(titleInput, "My launch post");
    expect(titleInput).toHaveValue("My launch post");

    // Choosing a template preset updates the selected state.
    const sunset = screen.getByTestId("template-sunset");
    await user.click(sunset);
    expect(sunset).toHaveAttribute("aria-pressed", "true");
  });

  it("exports a PNG via canvas.toBlob and createObjectURL", async () => {
    const user = userEvent.setup();
    render(<OgImageGenerator />);

    const titleInput = screen.getByLabelText("Title");
    await user.clear(titleInput);
    await user.type(titleInput, "Social card");

    await user.click(screen.getByRole("button", { name: /export png/i }));

    await waitFor(() =>
      expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalled()
    );
    expect(URL.createObjectURL).toHaveBeenCalled();

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it("copies the og:image meta-tag snippet to the clipboard", async () => {
    const user = userEvent.setup();
    render(<OgImageGenerator />);

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    await user.click(screen.getByRole("button", { name: /copy/i }));

    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(spy.mock.calls[0][0]).toContain('property="og:image"');
  });
});
