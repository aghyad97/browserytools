import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextCaseConverter from "@/components/TextCaseConverter";

describe("TextCaseConverter", () => {
  it("renders the input and output textareas", () => {
    render(<TextCaseConverter />);
    expect(screen.getByPlaceholderText("Enter your text here...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Converted text will appear here...")).toBeInTheDocument();
  });

  it("converts text to UPPERCASE when UPPER tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TextCaseConverter />);

    const input = screen.getByPlaceholderText("Enter your text here...");
    await user.type(input, "hello world");

    await user.click(screen.getByRole("tab", { name: "UPPER" }));

    const output = screen.getByPlaceholderText("Converted text will appear here...");
    expect(output).toHaveValue("HELLO WORLD");
  });

  it("converts text to snake_case when snake_case tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TextCaseConverter />);

    const input = screen.getByPlaceholderText("Enter your text here...");
    await user.type(input, "hello world");

    await user.click(screen.getByRole("tab", { name: "snake_case" }));

    const output = screen.getByPlaceholderText("Converted text will appear here...");
    expect(output).toHaveValue("hello_world");
  });

  it("converts text to camelCase when camelCase tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TextCaseConverter />);

    const input = screen.getByPlaceholderText("Enter your text here...");
    await user.type(input, "hello world");

    await user.click(screen.getByRole("tab", { name: "camelCase" }));

    const output = screen.getByPlaceholderText("Converted text will appear here...");
    expect(output).toHaveValue("helloWorld");
  });

  it("updates output in real-time as user types (uppercase mode active)", async () => {
    const user = userEvent.setup();
    render(<TextCaseConverter />);

    // First click UPPER to activate it
    await user.click(screen.getByRole("tab", { name: "UPPER" }));

    const input = screen.getByPlaceholderText("Enter your text here...");
    await user.type(input, "abc");

    const output = screen.getByPlaceholderText("Converted text will appear here...");
    expect(output).toHaveValue("ABC");
  });

  it("copies output to clipboard when Copy is clicked", async () => {
    const user = userEvent.setup();
    render(<TextCaseConverter />);

    const input = screen.getByPlaceholderText("Enter your text here...");
    await user.type(input, "copy me");

    await user.click(screen.getByRole("tab", { name: "UPPER" }));

    // Spy after userEvent may have replaced clipboard with its own implementation
    const writeSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy/i }));

    expect(writeSpy).toHaveBeenCalledWith("COPY ME");
  });

  it("clears both input and output when Clear is clicked", async () => {
    const user = userEvent.setup();
    render(<TextCaseConverter />);

    const input = screen.getByPlaceholderText("Enter your text here...");
    await user.type(input, "some text");
    await user.click(screen.getByRole("tab", { name: "UPPER" }));

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(input).toHaveValue("");
    const output = screen.getByPlaceholderText("Converted text will appear here...");
    expect(output).toHaveValue("");
  });

  it("shows the character count for input", async () => {
    const user = userEvent.setup();
    render(<TextCaseConverter />);

    const input = screen.getByPlaceholderText("Enter your text here...");
    await user.type(input, "hello");

    expect(screen.getAllByText("5 characters")[0]).toBeInTheDocument();
  });
});
