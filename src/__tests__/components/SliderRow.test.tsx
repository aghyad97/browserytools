import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SliderRow } from "@/components/shared/SliderRow";

describe("SliderRow", () => {
  it("renders the label and the raw value by default", () => {
    render(<SliderRow label="Length" value={16} min={4} max={64} onChange={() => {}} />);
    expect(screen.getByText("Length")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
  });

  it("renders a custom display readout when provided", () => {
    render(
      <SliderRow label="Size" value={2048} min={0} max={4096} display="2.0 KB" onChange={() => {}} />
    );
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
    expect(screen.queryByText("2048")).not.toBeInTheDocument();
  });

  it("exposes an accessible slider reflecting the value and bounds", () => {
    render(<SliderRow label="Quality" value={80} min={0} max={100} onChange={() => {}} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "80");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });
});
