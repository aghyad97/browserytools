import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TwoPane } from "@/components/shared/TwoPane";

describe("TwoPane", () => {
  it("renders both start and end content", () => {
    render(
      <TwoPane
        start={<span data-testid="in">input</span>}
        end={<span data-testid="out">output</span>}
      />
    );
    expect(screen.getByTestId("in")).toBeInTheDocument();
    expect(screen.getByTestId("out")).toBeInTheDocument();
  });

  it("defaults --ratio to 1 and applies a custom ratio", () => {
    const { rerender } = render(
      <TwoPane data-testid="pane" start={<i />} end={<i />} />
    );
    expect(screen.getByTestId("pane").style.getPropertyValue("--ratio")).toBe("1");

    rerender(<TwoPane data-testid="pane" ratio={2} start={<i />} end={<i />} />);
    expect(screen.getByTestId("pane").style.getPropertyValue("--ratio")).toBe("2");
  });
});
