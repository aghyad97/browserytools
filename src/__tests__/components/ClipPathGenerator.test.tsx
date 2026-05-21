import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClipPathGenerator from "@/components/ClipPathGenerator";

describe("ClipPathGenerator", () => {
  it("renders the default triangle polygon clip-path CSS", () => {
    render(<ClipPathGenerator />);
    // Default shape is the triangle preset
    expect(
      screen.getByText(/clip-path: polygon\(50% 0%, 100% 100%, 0% 100%\);/),
    ).toBeInTheDocument();
    // Always emits the -webkit- prefixed declaration too
    expect(
      screen.getByText(/-webkit-clip-path: polygon\(50% 0%, 100% 100%, 0% 100%\);/),
    ).toBeInTheDocument();
  });

  it("loads the Hexagon preset and outputs its clip-path", async () => {
    const user = userEvent.setup();
    render(<ClipPathGenerator />);

    // Preset buttons have a title equal to the shape name
    const hexagonBtn = screen.getByTitle("Hexagon");
    await user.click(hexagonBtn);

    expect(
      screen.getByText(
        /clip-path: polygon\(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%\);/,
      ),
    ).toBeInTheDocument();
  });

  it("copies the generated clip-path CSS to the clipboard", async () => {
    const user = userEvent.setup();
    render(<ClipPathGenerator />);

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    const copyBtn = screen.getByRole("button", { name: /copy css/i });
    await user.click(copyBtn);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("clip-path: polygon(50% 0%, 100% 100%, 0% 100%);"),
    );
  });
});
