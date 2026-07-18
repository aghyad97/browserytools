import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StylePanel } from "@/components/subtitle-studio/StylePanel";
import { PRESETS } from "@/lib/subtitles/styles";

describe("StylePanel", () => {
  it("picking a different preset calls onChange with that exact preset object", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StylePanel value={PRESETS["clean-caption"]} onChange={onChange} />);

    await user.click(screen.getByTestId("style-preset-tiktok-bold"));

    expect(onChange).toHaveBeenCalledWith(PRESETS["tiktok-bold"]);
  });

  it("changing the primary colour merges it and preserves other fields", () => {
    const onChange = vi.fn();
    const value = PRESETS["clean-caption"];
    render(<StylePanel value={value} onChange={onChange} />);

    fireEvent.change(screen.getByTestId("style-primary-color"), {
      target: { value: "#123456" },
    });

    expect(onChange).toHaveBeenCalledWith({ ...value, primary: "#123456" });
  });

  it("the highlight colour input exists and changing it merges highlight", () => {
    const onChange = vi.fn();
    const value = PRESETS["clean-caption"];
    render(<StylePanel value={value} onChange={onChange} />);

    const highlightInput = screen.getByTestId("style-highlight-color");
    expect(highlightInput).toBeInTheDocument();

    fireEvent.change(highlightInput, { target: { value: "#abcdef" } });

    expect(onChange).toHaveBeenCalledWith({ ...value, highlight: "#abcdef" });
  });

  it("changing the animation preset calls onChange with the new animation", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = PRESETS["clean-caption"];
    render(<StylePanel value={value} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /karaoke/i }));

    expect(onChange).toHaveBeenCalledWith({ ...value, animation: "karaoke" });
  });

  it("marks the matching preset as active and no preset active after a tweak", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <StylePanel value={PRESETS["clean-caption"]} onChange={onChange} />
    );
    expect(screen.getByTestId("style-preset-clean-caption")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    rerender(
      <StylePanel
        value={{ ...PRESETS["clean-caption"], primary: "#000000" }}
        onChange={onChange}
      />
    );
    expect(screen.getByTestId("style-preset-clean-caption")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("changing the position calls onChange with the new alignment", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = PRESETS["clean-caption"];
    render(<StylePanel value={value} onChange={onChange} />);

    await user.click(screen.getByTestId("style-alignment-7"));

    expect(onChange).toHaveBeenCalledWith({ ...value, alignment: 7 });
  });

  it("toggling the background box checkbox merges box", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = PRESETS["clean-caption"];
    render(<StylePanel value={value} onChange={onChange} />);

    await user.click(screen.getByTestId("style-box"));

    expect(onChange).toHaveBeenCalledWith({ ...value, box: true });
  });
});
