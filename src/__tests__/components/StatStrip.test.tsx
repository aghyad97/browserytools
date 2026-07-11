import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatStrip } from "@/components/shared/StatStrip";

describe("StatStrip", () => {
  it("renders each item's label and value", () => {
    render(
      <StatStrip
        items={[
          { label: "Words", value: 128 },
          { label: "Characters", value: "742" },
        ]}
      />
    );
    expect(screen.getByText("Words")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("Characters")).toBeInTheDocument();
    expect(screen.getByText("742")).toBeInTheDocument();
  });

  it("renders nothing but an empty container for an empty list", () => {
    render(<StatStrip items={[]} data-testid="strip" />);
    expect(screen.getByTestId("strip").childElementCount).toBe(0);
  });
});
