import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ModePicker } from "@/components/shared/ModePicker";

const options = [
  { value: "js", label: "JavaScript" },
  { value: "py", label: "Python" },
  { value: "go", label: "Go" },
];

/** happy-dom has no real layout, so offsetLeft/offsetWidth are always 0.
 * Stub them per-element so the measured-indicator logic has something real
 * to read, mirroring what a laid-out flex row of unequal-width segments
 * would report. */
function stubOffsets(lefts: number[], widths: number[]) {
  const originalLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetLeft");
  const originalWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
  let callIndex = { left: 0, width: 0 };

  Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
    configurable: true,
    get() {
      const buttons = Array.from(document.querySelectorAll("button"));
      const i = buttons.indexOf(this as HTMLButtonElement);
      return i >= 0 ? lefts[i] : 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      const buttons = Array.from(document.querySelectorAll("button"));
      const i = buttons.indexOf(this as HTMLButtonElement);
      return i >= 0 ? widths[i] : 0;
    },
  });

  return () => {
    if (originalLeft) Object.defineProperty(HTMLElement.prototype, "offsetLeft", originalLeft);
    if (originalWidth) Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalWidth);
  };
}

describe("ModePicker", () => {
  afterEach(() => {
    cleanup();
  });

  it("labels the group and renders every option", () => {
    render(<ModePicker options={options} value="js" onChange={() => {}} aria-label="Output language" />);
    expect(screen.getByRole("group", { name: "Output language" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "JavaScript" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Python" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("marks the active option with aria-pressed", () => {
    render(<ModePicker options={options} value="py" onChange={() => {}} aria-label="Output language" />);
    expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "JavaScript" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the option value on click", () => {
    const onChange = vi.fn();
    render(<ModePicker options={options} value="js" onChange={onChange} aria-label="Output language" />);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onChange).toHaveBeenCalledWith("go");
  });

  it("positions the indicator from the active segment's measured offsetLeft/offsetWidth", () => {
    const restore = stubOffsets([0, 60, 130], [56, 66, 40]);
    try {
      const { rerender } = render(
        <ModePicker options={options} value="py" onChange={() => {}} aria-label="Output language" />
      );
      const group = screen.getByRole("group", { name: "Output language" });
      expect(group.style.getPropertyValue("--x")).toBe("60px");
      expect(group.style.getPropertyValue("--w")).toBe("66px");

      rerender(<ModePicker options={options} value="go" onChange={() => {}} aria-label="Output language" />);
      expect(group.style.getPropertyValue("--x")).toBe("130px");
      expect(group.style.getPropertyValue("--w")).toBe("40px");
    } finally {
      restore();
    }
  });

  it("scrolls the active segment into view when the active option changes", () => {
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    const { rerender } = render(
      <ModePicker options={options} value="js" onChange={() => {}} aria-label="Output language" />
    );
    scrollIntoView.mockClear();

    rerender(<ModePicker options={options} value="go" onChange={() => {}} aria-label="Output language" />);
    expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ inline: "nearest", block: "nearest" }));
  });

  it("renders correctly with a large option count (6, unit-converter-style) without dropping any", () => {
    const many = [
      { value: "length", label: "Length" },
      { value: "mass", label: "Mass" },
      { value: "temperature", label: "Temperature" },
      { value: "area", label: "Area" },
      { value: "volume", label: "Volume" },
      { value: "speed", label: "Speed" },
    ];
    render(<ModePicker options={many} value="temperature" onChange={() => {}} aria-label="Category" />);
    for (const opt of many) {
      expect(screen.getByRole("button", { name: opt.label })).toBeInTheDocument();
    }
  });

  it("root track is horizontally scrollable so overflowing segments don't blow out the layout (CSS smoke)", () => {
    const css = readFileSync(
      path.resolve(__dirname, "../../components/shared/ModePicker.module.css"),
      "utf-8"
    );
    const pickerRule = css.slice(css.indexOf(".picker {"), css.indexOf(".picker::-webkit-scrollbar"));
    expect(pickerRule).toMatch(/overflow-x:\s*auto/);
    expect(pickerRule).toMatch(/overscroll-behavior-x:\s*contain/);
    expect(css).toMatch(/\.picker::-webkit-scrollbar\s*\{\s*display:\s*none;/);
  });
});
