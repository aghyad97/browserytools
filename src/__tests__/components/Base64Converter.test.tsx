import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Base64Converter from "@/components/Base64Converter";

// Encode "Hello World" → SGVsbG8gV29ybGQ=
const HELLO_ENCODED = "SGVsbG8gV29ybGQ=";

describe("Base64Converter", () => {
  it("renders input and output textareas", () => {
    render(<Base64Converter />);
    // At least one textarea present
    const textareas = screen.getAllByRole("textbox");
    expect(textareas.length).toBeGreaterThanOrEqual(2);
  });

  it("encodes 'Hello World' to Base64 in real-time", async () => {
    const user = userEvent.setup();
    render(<Base64Converter />);

    // The mode selector starts in "encode" — find the first textarea (input)
    const [inputArea] = screen.getAllByRole("textbox");
    await user.type(inputArea, "Hello World");

    // The second textarea is read-only output
    const textareas = screen.getAllByRole("textbox");
    const outputArea = textareas[1];
    expect(outputArea).toHaveValue(HELLO_ENCODED);
  });

  it("calls the convert action when Convert button is clicked", async () => {
    const user = userEvent.setup();
    render(<Base64Converter />);

    const [inputArea] = screen.getAllByRole("textbox");
    await user.type(inputArea, "Hello World");

    const convertBtn = screen.getByRole("button", { name: /convert/i });
    await user.click(convertBtn);

    const textareas = screen.getAllByRole("textbox");
    expect(textareas[1]).toHaveValue(HELLO_ENCODED);
  });

  it("copies output to clipboard when Copy is clicked", async () => {
    const user = userEvent.setup();
    render(<Base64Converter />);

    const [inputArea] = screen.getAllByRole("textbox");
    await user.type(inputArea, "Hello World");

    // Spy after userEvent may have replaced clipboard
    const writeSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const copyBtn = screen.getByRole("button", { name: /copy/i });
    await user.click(copyBtn);

    expect(writeSpy).toHaveBeenCalledWith(HELLO_ENCODED);
  });

  it("decodes Base64 back to original text in decode mode", async () => {
    const user = userEvent.setup();
    render(<Base64Converter />);

    // Switch to decode mode
    const modeSelect = screen.getByRole("combobox");
    await user.click(modeSelect);
    const decodeOption = screen.getByRole("option", { name: /decode/i });
    await user.click(decodeOption);

    const [inputArea] = screen.getAllByRole("textbox");
    await user.type(inputArea, HELLO_ENCODED);

    const textareas = screen.getAllByRole("textbox");
    expect(textareas[1]).toHaveValue("Hello World");
  });
});
