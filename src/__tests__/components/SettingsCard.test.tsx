import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";

describe("SettingsCard", () => {
  it("renders title, description and children", () => {
    render(
      <SettingsCard title="Options" description="tune the output">
        <span data-testid="content">body</span>
      </SettingsCard>
    );
    expect(screen.getByText("Options")).toBeInTheDocument();
    expect(screen.getByText("tune the output")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("omits the head block when no title/description", () => {
    const { container } = render(
      <SettingsCard>
        <span>only body</span>
      </SettingsCard>
    );
    expect(screen.getByText("only body")).toBeInTheDocument();
    // no <p> description present
    expect(container.querySelector("p")).toBeNull();
  });
});

describe("OptionRow", () => {
  it("wires the label to a control via htmlFor", () => {
    render(
      <OptionRow label="Width" htmlFor="w">
        <input id="w" />
      </OptionRow>
    );
    const label = screen.getByText("Width");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "w");
    // the label is associated with the input
    expect(screen.getByLabelText("Width")).toBeInTheDocument();
  });

  it("renders the label as a span when no htmlFor is given", () => {
    render(
      <OptionRow label="Static">
        <input />
      </OptionRow>
    );
    expect(screen.getByText("Static").tagName).toBe("SPAN");
  });

  it("renders an optional hint", () => {
    render(
      <OptionRow label="Quality" hint="80%">
        <input />
      </OptionRow>
    );
    expect(screen.getByText("80%")).toBeInTheDocument();
  });
});
