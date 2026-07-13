import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SvgBlobGenerator from "@/components/SvgBlobGenerator";

describe("SvgBlobGenerator", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the SVG markup output with a closed bézier path", () => {
    render(<SvgBlobGenerator />);
    const output = screen.getByTestId("svg-output");
    const text = output.textContent ?? "";
    expect(text).toContain("<svg");
    expect(text).toContain("<path");
    expect(text).toMatch(/d="M[^"]*C[^"]*Z"/); // closed cubic-bézier path
    expect(text).toContain("</svg>");
  });

  it("regenerate produces a different path", async () => {
    const user = userEvent.setup();
    // First seed value, then a different one on regenerate.
    const randomSpy = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.123456)
      .mockReturnValue(0.987654);

    render(<SvgBlobGenerator />);
    const pathEl = screen.getByTestId("preview-path");
    const before = pathEl.getAttribute("d");

    await user.click(screen.getByTestId("regenerate"));

    const after = screen
      .getByTestId("preview-path")
      .getAttribute("d");
    expect(after).not.toBe(before);
    expect(randomSpy).toHaveBeenCalled();
  });

  it("copies SVG markup to the clipboard", async () => {
    // Copy now lives in the shared OutputPanel header (contract: OutputPanel
    // owns copy+download, local duplicate buttons deduped) — queried by its
    // accessible name ("Copy SVG") instead of the removed copy-svg testid.
    const user = userEvent.setup();
    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(<SvgBlobGenerator />);
    await user.click(screen.getByRole("button", { name: /copy svg/i }));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain("<svg");
    expect(spy.mock.calls[0][0]).toContain("<path");
  });

  it("downloads an .svg file", async () => {
    // Download now lives in the shared OutputPanel header, queried by its
    // accessible name ("Download") instead of the removed download-svg testid.
    const user = userEvent.setup();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const createUrl = vi.spyOn(URL, "createObjectURL");

    render(<SvgBlobGenerator />);
    await user.click(screen.getByRole("button", { name: /download/i }));

    expect(createUrl).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("switches to wave divider mode and outputs a wave path", async () => {
    const user = userEvent.setup();
    render(<SvgBlobGenerator />);

    await user.click(screen.getByTestId("mode-wave"));
    const text = screen.getByTestId("svg-output").textContent ?? "";
    // Wave path closes down to the bottom edge with L commands then Z.
    expect(text).toMatch(/L[\d.]+,[\d.]+L0,[\d.]+Z/);
  });
});
