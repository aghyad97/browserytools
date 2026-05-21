import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AgeCalculator from "@/components/AgeCalculator";

describe("AgeCalculator", () => {
  it("renders the single-age and difference tabs", () => {
    render(<AgeCalculator />);
    expect(
      screen.getByRole("tab", { name: /single age/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /age difference/i })
    ).toBeInTheDocument();
  });

  it("shows an error toast when calculating with no birth date", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<AgeCalculator />);

    await user.click(screen.getByRole("button", { name: /^calculate age$/i }));
    expect(toast.error).toHaveBeenCalled();
  });

  // Issue #13: the birth-date picker must offer month + year dropdowns
  // (instead of arrow-scrolling) reaching back many decades.
  it("renders month and year dropdowns in the birth-date calendar", async () => {
    const user = userEvent.setup();
    render(<AgeCalculator />);

    await user.click(
      screen.getByRole("button", { name: /select birth date/i })
    );

    // react-day-picker renders native <select> elements (role combobox)
    // for month and year when captionLayout="dropdown".
    const comboboxes = await screen.findAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThanOrEqual(2);
  });

  it("offers historical years (e.g. 1950) in the year dropdown", async () => {
    const user = userEvent.setup();
    render(<AgeCalculator />);

    await user.click(
      screen.getByRole("button", { name: /select birth date/i })
    );

    const comboboxes = await screen.findAllByRole("combobox");
    // The year dropdown is the one containing a four-digit year option.
    const yearSelect = comboboxes.find((cb) =>
      within(cb).queryByRole("option", { name: "1950" })
    );
    expect(yearSelect).toBeTruthy();
  });
});
