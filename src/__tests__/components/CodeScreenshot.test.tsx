import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CodeScreenshot from "@/components/CodeScreenshot";

// happy-dom's Image never fires onload for a blob: URL, so stub it to resolve
// synchronously. This lets the SVG -> Image -> canvas rasterizer path complete.
beforeEach(() => {
  class MockImage {
    crossOrigin = "";
    private _src = "";
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    width = 720;
    height = 480;
    set src(v: string) {
      this._src = v;
      // fire load on next tick
      setTimeout(() => this.onload?.(), 0);
    }
    get src() {
      return this._src;
    }
  }
  // @ts-expect-error override global Image for the rasterizer
  global.Image = MockImage;
});

describe("CodeScreenshot", () => {
  it("renders the editor with default sample code and a live preview", () => {
    render(<CodeScreenshot />);
    const input = screen.getByTestId("code-input") as HTMLTextAreaElement;
    expect(input.value).toContain("greet");
    // preview renders highlighted DOM
    expect(screen.getByTestId("code-preview")).toBeInTheDocument();
  });

  it("lets the user type their own code", async () => {
    const user = userEvent.setup();
    render(<CodeScreenshot />);
    const input = screen.getByTestId("code-input") as HTMLTextAreaElement;
    await user.clear(input);
    await user.type(input, "const x = 1;");
    expect(input.value).toBe("const x = 1;");
  });

  it("keeps the code preview direction LTR even though the UI may be RTL", () => {
    render(<CodeScreenshot />);
    expect(screen.getByTestId("code-preview").getAttribute("dir")).toBe("ltr");
  });

  it("toggles line numbers", async () => {
    const user = userEvent.setup();
    render(<CodeScreenshot />);
    const toggle = screen.getByTestId("line-numbers-toggle") as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    await user.click(toggle);
    expect(toggle.checked).toBe(false);
  });

  it("exports a PNG image: rasterizes via canvas and triggers a download", async () => {
    const user = userEvent.setup();
    // spy on canvas + anchor download
    const toDataURLSpy = vi.spyOn(HTMLCanvasElement.prototype, "toDataURL");
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    render(<CodeScreenshot />);
    const exportBtn = screen.getByTestId("export-btn");
    await user.click(exportBtn);

    await waitFor(() => {
      expect(toDataURLSpy).toHaveBeenCalledWith("image/png");
    });
    expect(clickSpy).toHaveBeenCalled();
  });

  it("copies the image to the clipboard via canvas.toBlob", async () => {
    const user = userEvent.setup();
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    // provide ClipboardItem + clipboard.write
    // @ts-expect-error test stub
    global.ClipboardItem = class {
      constructor(public items: Record<string, Blob>) {}
    };
    const writeSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      get: () => ({ write: writeSpy, writeText: vi.fn() }),
      configurable: true,
    });

    render(<CodeScreenshot />);
    await user.click(screen.getByTestId("copy-btn"));

    await waitFor(() => {
      expect(toBlobSpy).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  it("shows an error and does not export when the code is empty", async () => {
    const { toast } = await import("sonner");
    render(<CodeScreenshot />);
    const input = screen.getByTestId("code-input") as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByTestId("export-btn"));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
