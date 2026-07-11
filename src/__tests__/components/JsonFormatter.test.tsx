import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JsonFormatter from "@/components/JsonFormatter";

// The five-zone ToolShell pilot (text archetype). Drive the real flow:
// type JSON → Format (shell primary) → output populated; Copy via CopyButton.

describe("JsonFormatter (ToolShell pilot)", () => {
  it("renders inside the shell with exactly one h1", () => {
    render(<JsonFormatter />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
  });

  it("formats valid JSON via the shell primary action", async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    const input = screen.getByPlaceholderText("Paste your JSON here...");
    await user.click(input);
    await user.paste('{"b":2,"a":1}');

    const { toast } = await import("sonner");
    await user.click(screen.getByTestId("tool-shell-primary"));

    const output = screen.getByPlaceholderText(
      "Formatted output will appear here...",
    ) as HTMLTextAreaElement;
    await waitFor(() => expect(output.value).toContain('"a": 1'));
    expect(output.value).toContain('"b": 2');
    expect(toast.success).toHaveBeenCalled();
  });

  it("copies the output via CopyButton (translated success message)", async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    const input = screen.getByPlaceholderText("Paste your JSON here...");
    await user.click(input);
    await user.paste('{"a":1}');
    await user.click(screen.getByTestId("tool-shell-primary")); // format

    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    // CopyButton is labelled with the translated "Copy" aria-label.
    await user.click(screen.getByRole("button", { name: /^copy$/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(writeText.mock.calls[0][0]).toContain('"a": 1');
  });

  it("surfaces a parse error banner on invalid JSON", async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    const input = screen.getByPlaceholderText("Paste your JSON here...");
    await user.click(input);
    await user.paste("not json");

    const { toast } = await import("sonner");
    await user.click(screen.getByTestId("tool-shell-primary"));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(screen.getByText(/parse error/i)).toBeInTheDocument();
  });
});
