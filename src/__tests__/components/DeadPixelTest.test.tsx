import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeadPixelTest from "@/components/DeadPixelTest";

// happy-dom has no Fullscreen API. Stub requestFullscreen on the prototype so
// start() can request it, and exitFullscreen so the Esc path is a no-op.
beforeAll(() => {
  HTMLElement.prototype.requestFullscreen = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(document, "exitFullscreen", {
    value: vi.fn().mockResolvedValue(undefined),
    configurable: true,
  });
});

describe("DeadPixelTest", () => {
  it("renders inside the shell with a single h1 and no overlay until started", () => {
    render(<DeadPixelTest />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
    // The fullscreen overlay is only present while a test is running.
    expect(screen.queryByTestId("dead-pixel-overlay")).toBeNull();
  });

  it("starts fullscreen on white, then cycles colours on click and ArrowRight", () => {
    render(<DeadPixelTest />);

    fireEvent.click(screen.getByTestId("tool-shell-primary"));
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalled();

    const overlay = screen.getByTestId("dead-pixel-overlay");
    expect(overlay).toHaveAttribute("data-color", "#ffffff");
    expect(overlay).toHaveStyle({ background: "#ffffff" });

    // A click on the overlay advances to the next colour (black).
    fireEvent.click(overlay);
    expect(screen.getByTestId("dead-pixel-overlay")).toHaveAttribute("data-color", "#000000");

    // ArrowRight also advances (red).
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("dead-pixel-overlay")).toHaveAttribute("data-color", "#ff0000");

    // ArrowLeft steps back (black).
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByTestId("dead-pixel-overlay")).toHaveAttribute("data-color", "#000000");
  });

  it("hides the overlay when fullscreen is exited by any means", () => {
    render(<DeadPixelTest />);
    fireEvent.click(screen.getByTestId("tool-shell-primary"));
    expect(screen.getByTestId("dead-pixel-overlay")).toBeInTheDocument();

    // User exits fullscreen (Esc / browser chrome) → fullscreenElement is null.
    Object.defineProperty(document, "fullscreenElement", {
      value: null,
      configurable: true,
    });
    fireEvent(document, new Event("fullscreenchange"));

    expect(screen.queryByTestId("dead-pixel-overlay")).toBeNull();
  });
});
