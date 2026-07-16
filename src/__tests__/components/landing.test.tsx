import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Landing from "@/components/landing/landing";
import { useCategoryFilterStore } from "@/store/category-filter-store";

// Rail's chip row and Landing's Popular grid must both read/write the shared
// category-filter store (spec: wire rail categories to the landing filter).
// These assertions were RED against the pre-fix code, which kept its own
// private `useState` and never looked at the store — writing to the store
// had no effect on what Landing rendered.
beforeEach(() => {
  useCategoryFilterStore.setState({ category: null });
});

/** The Popular grid is the sibling right after the chip filter row. */
function getPopularGrid(): HTMLElement {
  const allBtn = screen.getByRole("button", { name: "All" });
  const filtersRow = allBtn.parentElement as HTMLElement;
  return filtersRow.nextElementSibling as HTMLElement;
}

describe("Landing — category filter store", () => {
  it("renders the full (uncapped-by-category) Popular grid when store category is null", () => {
    render(<Landing />);
    const grid = getPopularGrid();
    expect(within(grid).getAllByRole("link").length).toBe(47);
  });

  it("filters the Popular grid to the store's active category", () => {
    // testsGames held exactly one tool (Typing Test) pre-Wave-1; Task 3 added
    // Keyboard Tester, Gamepad Tester, and Dead Pixel Test to the category,
    // so it now resolves to 4 — still a small, easy-to-assert category.
    useCategoryFilterStore.setState({ category: "testsGames" });
    render(<Landing />);

    const grid = getPopularGrid();
    const links = within(grid).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(within(grid).getByText("Typing Test")).toBeInTheDocument();
  });

  it("reacts to a category set externally (e.g. by the rail) after mount, with no local state to go stale", () => {
    const { rerender } = render(<Landing />);
    expect(within(getPopularGrid()).getAllByRole("link")).toHaveLength(47);

    useCategoryFilterStore.setState({ category: "testsGames" });
    rerender(<Landing />);

    expect(within(getPopularGrid()).getAllByRole("link")).toHaveLength(4);
  });
});
