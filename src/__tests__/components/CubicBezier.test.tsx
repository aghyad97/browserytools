import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CubicBezier from "@/components/CubicBezier";

describe("CubicBezier", () => {
  it("renders the curve canvas and animation preview element", () => {
    render(<CubicBezier />);
    expect(screen.getByTestId("bezier-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("preview-dot")).toBeInTheDocument();
    expect(screen.getByTestId("play-preview")).toBeInTheDocument();
  });

  it("shows the default ease cubic-bezier() in the output", () => {
    render(<CubicBezier />);
    const out = screen.getByTestId("css-output");
    expect(out.textContent).toContain("cubic-bezier(0.25, 0.1, 0.25, 1)");
    expect(out.textContent).toContain("transition-timing-function");
  });

  it("updates the cubic-bezier() output when a preset is selected", async () => {
    const user = userEvent.setup();
    render(<CubicBezier />);
    const out = screen.getByTestId("css-output");

    await user.click(screen.getByTestId("preset-ease-in-out"));
    expect(out.textContent).toContain("cubic-bezier(0.42, 0, 0.58, 1)");

    await user.click(screen.getByTestId("preset-linear"));
    expect(out.textContent).toContain("cubic-bezier(0, 0, 1, 1)");
  });

  it("copies the generated CSS to the clipboard", async () => {
    const user = userEvent.setup();
    render(<CubicBezier />);

    const spy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const copyBtn = screen.getByRole("button", { name: /copy css/i });
    await user.click(copyBtn);

    expect(spy).toHaveBeenCalledWith(
      "transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);"
    );
  });

  it("replays the preview by re-mounting the dot when Play is clicked", async () => {
    const user = userEvent.setup();
    render(<CubicBezier />);
    expect(screen.getByTestId("preview-dot")).toBeInTheDocument();
    await user.click(screen.getByTestId("play-preview"));
    // dot still present after replay
    expect(screen.getByTestId("preview-dot")).toBeInTheDocument();
  });
});
