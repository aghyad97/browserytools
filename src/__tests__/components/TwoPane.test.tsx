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

  it("builds the grid track string from ratio (default 1)", () => {
    // The track string is authored in JS as valid fr units — a bare unitless
    // var (`1 1fr`) or fr-in-calc is an invalid grid track that collapses the
    // grid to one column, so the component emits "<ratio>fr 1fr" via --cols.
    const { rerender } = render(
      <TwoPane data-testid="pane" start={<i />} end={<i />} />
    );
    expect(screen.getByTestId("pane").style.getPropertyValue("--cols")).toBe("1fr 1fr");

    rerender(<TwoPane data-testid="pane" ratio={2} start={<i />} end={<i />} />);
    expect(screen.getByTestId("pane").style.getPropertyValue("--cols")).toBe("2fr 1fr");
  });
});
