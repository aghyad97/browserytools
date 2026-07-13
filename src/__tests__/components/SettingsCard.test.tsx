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

  it("renders an optional header action alongside the title", () => {
    render(
      <SettingsCard title="All Expenses" description="Manage" action={<button>Add</button>}>
        <span>body</span>
      </SettingsCard>
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("places title at the row start and action at the row end (RTL-safe via flex order)", () => {
    // A REAL layout assertion, not just "the button exists somewhere": title
    // and action must be SIBLINGS in one flex row so `justify-content:
    // space-between` pushes title to inline-start and action to inline-end
    // regardless of direction (mirrors automatically under dir="rtl" — no
    // separate RTL-only markup needed). Description must NOT be inside that
    // row (it spans full width on its own line below).
    render(
      <SettingsCard title="All Expenses" description="Manage" action={<button>Add</button>}>
        <span>body</span>
      </SettingsCard>
    );
    const title = screen.getByText("All Expenses");
    const actionButton = screen.getByRole("button", { name: "Add" });
    const actionContainer = actionButton.parentElement as HTMLElement;
    const description = screen.getByText("Manage");

    // title and action are siblings in ONE flex row.
    expect(title.parentElement).toBe(actionContainer.parentElement);
    const row = title.parentElement as HTMLElement;
    const [first, last] = Array.from(row.children);
    expect(first).toBe(title);
    expect(last).toBe(actionContainer);
    // description lives in the head block but outside the title/action row.
    expect(description.parentElement).not.toBe(row);
  });

  it("renders the action even with no description", () => {
    render(<SettingsCard title="Options" action={<button>Go</button>} />);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("renders the action even with no title", () => {
    render(<SettingsCard action={<button>Go</button>} />);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
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
