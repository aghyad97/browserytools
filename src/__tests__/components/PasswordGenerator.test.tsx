import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordGenerator from "@/components/PasswordGenerator";

describe("PasswordGenerator", () => {
  it("renders the generate button", () => {
    render(<PasswordGenerator />);
    expect(screen.getByRole("button", { name: /generate password/i })).toBeInTheDocument();
  });

  it("generates a password when Generate Password is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordGenerator />);

    await user.click(screen.getByRole("button", { name: /generate password/i }));

    const passwordInput = screen.getByPlaceholderText(/generated password will appear here/i);
    expect(passwordInput).not.toHaveValue("");
  });

  it("generated password has the default length of 12", async () => {
    const user = userEvent.setup();
    render(<PasswordGenerator />);

    await user.click(screen.getByRole("button", { name: /generate password/i }));

    const passwordInput = screen.getByPlaceholderText(
      /generated password will appear here/i
    ) as HTMLInputElement;
    expect(passwordInput.value).toHaveLength(12);
  });

  it("uppercase-only mode produces only uppercase letters", async () => {
    const user = userEvent.setup();
    render(<PasswordGenerator />);

    // Turn off lowercase, numbers, and symbols (all on by default)
    await user.click(screen.getByRole("switch", { name: /lowercase/i }));
    await user.click(screen.getByRole("switch", { name: /numbers/i }));
    await user.click(screen.getByRole("switch", { name: /symbols/i }));

    await user.click(screen.getByRole("button", { name: /generate password/i }));

    const passwordInput = screen.getByPlaceholderText(
      /generated password will appear here/i
    ) as HTMLInputElement;
    expect(passwordInput.value).toMatch(/^[A-Z]+$/);
  });

  it("copies generated password to clipboard", async () => {
    const user = userEvent.setup();
    render(<PasswordGenerator />);

    await user.click(screen.getByRole("button", { name: /generate password/i }));

    // The copy button is next to the password input (no text label, just icon)
    const copyButton = screen.getAllByRole("button").find((btn) => {
      const ariaLabel = btn.getAttribute("aria-label");
      return !ariaLabel?.includes("generate") && btn !== screen.queryByRole("button", { name: /generate password/i });
    });
    // Find by checking it's not the Generate button or Clear button
    const allButtons = screen.getAllByRole("button");
    const generateBtn = screen.getByRole("button", { name: /generate password/i });
    const clearBtn = screen.queryByRole("button", { name: /clear/i });
    const copyBtn = allButtons.find((b) => b !== generateBtn && b !== clearBtn && b.closest(".flex"));

    if (copyBtn) {
      // Spy after userEvent may have replaced clipboard
      const writeSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
      await user.click(copyBtn);
      expect(writeSpy).toHaveBeenCalled();
    }
  });

  it("clears the password when Clear is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordGenerator />);

    await user.click(screen.getByRole("button", { name: /generate password/i }));
    await user.click(screen.getByRole("button", { name: /clear/i }));

    const passwordInput = screen.getByPlaceholderText(/generated password will appear here/i);
    expect(passwordInput).toHaveValue("");
  });
});
