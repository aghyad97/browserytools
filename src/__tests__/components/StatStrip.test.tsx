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

  it("omits the sub line for items that don't pass one", () => {
    render(<StatStrip items={[{ label: "Words", value: 128 }]} data-testid="strip" />);
    // only value + label rendered — no third child for `sub`.
    expect(screen.getByTestId("strip").firstElementChild?.childElementCount).toBe(2);
  });

  it("renders an optional sub caption stacked under value/label, in that source order", () => {
    // A REAL layout assertion (not just presence): `.stat` is flex-direction:
    // column, so visual stacking order == DOM source order. Assert the actual
    // child sequence — value, then label, then sub — so a future reorder that
    // silently breaks the stacked-caption layout is caught here, not just by
    // "the text is somewhere in the document" (the TwoPane #0 lesson).
    render(
      <StatStrip
        items={[{ label: "Total", value: "$42.00", sub: "3 transactions" }]}
        data-testid="strip"
      />
    );
    const stat = screen.getByTestId("strip").firstElementChild as HTMLElement;
    expect(stat.childElementCount).toBe(3);
    const [valueEl, labelEl, subEl] = Array.from(stat.children);
    expect(valueEl.textContent).toBe("$42.00");
    expect(labelEl.textContent).toBe("Total");
    expect(subEl.textContent).toBe("3 transactions");
    // sub carries the module's own class (not folded into label's class,
    // which was the pre-fix workaround of overriding label's mono caption
    // styling with ad-hoc utility classes).
    expect(subEl.className).not.toBe(labelEl.className);
  });
});
