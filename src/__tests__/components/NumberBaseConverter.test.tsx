import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberBaseConverter from "@/components/NumberBaseConverter";

describe("NumberBaseConverter", () => {
  it("renders all four base inputs", () => {
    render(<NumberBaseConverter />);
    expect(screen.getByLabelText("Binary")).toBeInTheDocument();
    expect(screen.getByLabelText("Octal")).toBeInTheDocument();
    expect(screen.getByLabelText("Decimal")).toBeInTheDocument();
    expect(screen.getByLabelText("Hexadecimal")).toBeInTheDocument();
  });

  it("converts 255 decimal to binary 11111111, octal 377, hex FF", async () => {
    const user = userEvent.setup();
    render(<NumberBaseConverter />);

    const decInput = screen.getByLabelText("Decimal");
    await user.type(decInput, "255");

    expect(screen.getByLabelText("Binary")).toHaveValue("11111111");
    expect(screen.getByLabelText("Octal")).toHaveValue("377");
    expect(screen.getByLabelText("Hexadecimal")).toHaveValue("FF");
  });

  it("converts hex FF to decimal 255 and binary 11111111", async () => {
    const user = userEvent.setup();
    render(<NumberBaseConverter />);

    const hexInput = screen.getByLabelText("Hexadecimal");
    await user.type(hexInput, "ff");

    expect(screen.getByLabelText("Decimal")).toHaveValue("255");
    expect(screen.getByLabelText("Binary")).toHaveValue("11111111");
  });

  it("converts binary 101 to decimal 5", async () => {
    const user = userEvent.setup();
    render(<NumberBaseConverter />);

    const binInput = screen.getByLabelText("Binary");
    await user.type(binInput, "101");

    expect(screen.getByLabelText("Decimal")).toHaveValue("5");
    expect(screen.getByLabelText("Octal")).toHaveValue("5");
  });

  it("clears all fields when Clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<NumberBaseConverter />);

    await user.type(screen.getByLabelText("Decimal"), "42");
    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByLabelText("Decimal")).toHaveValue("");
    expect(screen.getByLabelText("Binary")).toHaveValue("");
    expect(screen.getByLabelText("Hexadecimal")).toHaveValue("");
  });

  it("shows validation error styling for invalid binary input", async () => {
    const user = userEvent.setup();
    render(<NumberBaseConverter />);

    const binInput = screen.getByLabelText("Binary");
    await user.type(binInput, "999");

    expect(binInput).toHaveClass("border-destructive");
  });
});
