import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModePicker } from "@/components/shared/ModePicker";

const options = [
  { value: "js", label: "JavaScript" },
  { value: "py", label: "Python" },
  { value: "go", label: "Go" },
];

describe("ModePicker", () => {
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

  it("positions the indicator at the active index via --active", () => {
    render(<ModePicker options={options} value="go" onChange={() => {}} aria-label="Output language" />);
    const group = screen.getByRole("group", { name: "Output language" });
    expect(group.style.getPropertyValue("--active")).toBe("2");
    expect(group.style.getPropertyValue("--count")).toBe("3");
  });
});
