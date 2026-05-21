import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RomanNumeralConverter from "@/components/RomanNumeralConverter";

describe("RomanNumeralConverter", () => {
  it("renders the title and both conversion tabs", () => {
    render(<RomanNumeralConverter />);
    expect(
      screen.getByRole("heading", { name: /roman numeral converter/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /number to roman/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /roman to number/i })
    ).toBeInTheDocument();
  });

  it("converts a number to the correct Roman numeral", async () => {
    const user = userEvent.setup();
    const { container } = render(<RomanNumeralConverter />);
    const input = container.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    await user.type(input, "2024");
    expect(await screen.findByText("MMXXIV")).toBeInTheDocument();
  });

  it("shows an out-of-range error for numbers above 3999", async () => {
    const user = userEvent.setup();
    const { container } = render(<RomanNumeralConverter />);
    const input = container.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    await user.type(input, "5000");
    expect(
      await screen.findByText(/between 1 and 3999/i)
    ).toBeInTheDocument();
  });

  it("converts a Roman numeral back to a number", async () => {
    const user = userEvent.setup();
    render(<RomanNumeralConverter />);
    await user.click(screen.getByRole("tab", { name: /roman to number/i }));
    const input = screen.getByPlaceholderText(/MMXXIV/i);
    await user.type(input, "MMXXIV");
    expect(await screen.findByText("2,024")).toBeInTheDocument();
  });

  it("rejects invalid Roman numeral characters", async () => {
    const user = userEvent.setup();
    render(<RomanNumeralConverter />);
    await user.click(screen.getByRole("tab", { name: /roman to number/i }));
    const input = screen.getByPlaceholderText(/MMXXIV/i);
    await user.type(input, "ABC");
    expect(
      await screen.findByText(/only I, V, X, L, C, D, M allowed/i)
    ).toBeInTheDocument();
  });

  it("copies the Roman numeral result to the clipboard", async () => {
    const user = userEvent.setup();
    const { container } = render(<RomanNumeralConverter />);
    const input = container.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    await user.type(input, "42");
    await screen.findByText("XLII");
    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(spy).toHaveBeenCalledWith("XLII");
  });
});
