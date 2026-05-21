import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PeriodicTable from "@/components/PeriodicTable";

describe("PeriodicTable", () => {
  it("renders all 118 element tiles", () => {
    render(<PeriodicTable />);
    const tiles = screen.getAllByTestId("element-tile");
    expect(tiles).toHaveLength(118);
  });

  it("renders a known element (Hydrogen, symbol H)", () => {
    render(<PeriodicTable />);
    const h = screen
      .getAllByTestId("element-tile")
      .find((el) => el.getAttribute("data-symbol") === "H");
    expect(h).toBeTruthy();
    expect(h).toHaveTextContent("H");
    expect(h).toHaveAttribute("title", "Hydrogen");
  });

  it("shows element details when a tile is clicked", async () => {
    const user = userEvent.setup();
    render(<PeriodicTable />);
    const h = screen
      .getAllByTestId("element-tile")
      .find((el) => el.getAttribute("data-symbol") === "H")!;
    await user.click(h);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("Hydrogen");
    expect(dialog).toHaveTextContent("Atomic mass");
    expect(dialog).toHaveTextContent("1.008");
    expect(dialog).toHaveTextContent("Electron configuration");
  });

  it("filters tiles by search query (symbol)", async () => {
    const user = userEvent.setup();
    render(<PeriodicTable />);
    const search = screen.getByLabelText(/search by name/i);
    await user.type(search, "He");

    // Helium tile is matched (full opacity), Hydrogen is dimmed.
    const tiles = screen.getAllByTestId("element-tile");
    const helium = tiles.find((el) => el.getAttribute("data-symbol") === "He")!;
    const hydrogen = tiles.find((el) => el.getAttribute("data-symbol") === "H")!;
    expect(helium.className).toContain("opacity-100");
    expect(hydrogen.className).toContain("opacity-20");
  });

  it("filters tiles by search query (atomic number)", async () => {
    const user = userEvent.setup();
    render(<PeriodicTable />);
    const search = screen.getByLabelText(/search by name/i);
    await user.type(search, "8");

    const tiles = screen.getAllByTestId("element-tile");
    const oxygen = tiles.find((el) => el.getAttribute("data-symbol") === "O")!;
    expect(oxygen.className).toContain("opacity-100");
  });

  it("filters by category via the legend", async () => {
    const user = userEvent.setup();
    render(<PeriodicTable />);
    const nobleGasBtn = screen.getByRole("button", { name: /noble gas/i });
    await user.click(nobleGasBtn);

    const tiles = screen.getAllByTestId("element-tile");
    const helium = tiles.find((el) => el.getAttribute("data-symbol") === "He")!;
    const hydrogen = tiles.find((el) => el.getAttribute("data-symbol") === "H")!;
    expect(helium.className).toContain("opacity-100");
    expect(hydrogen.className).toContain("opacity-20");
  });
});
