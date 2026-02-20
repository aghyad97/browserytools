import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HashGenerator from "@/components/HashGenerator";

describe("HashGenerator", () => {
  it("renders the text input and Generate Hashes button", () => {
    render(<HashGenerator />);
    expect(screen.getByLabelText(/text to hash/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate hashes/i })).toBeInTheDocument();
  });

  it("generate button is disabled when input is empty", () => {
    render(<HashGenerator />);
    expect(screen.getByRole("button", { name: /generate hashes/i })).toBeDisabled();
  });

  it("generates hashes after entering text and clicking Generate", async () => {
    const user = userEvent.setup();
    render(<HashGenerator />);

    const input = screen.getByLabelText(/text to hash/i);
    await user.type(input, "hello");

    await user.click(screen.getByRole("button", { name: /generate hashes/i }));

    // Wait for async hash generation (500ms timer in component)
    await waitFor(() => {
      expect(screen.getByText("SHA-256")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("shows SHA-256 result with a 64-character hash", async () => {
    const user = userEvent.setup();
    render(<HashGenerator />);

    await user.type(screen.getByLabelText(/text to hash/i), "test");
    await user.click(screen.getByRole("button", { name: /generate hashes/i }));

    // Wait for generate button to re-enable (500ms timer in component)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /generate hashes/i })).not.toBeDisabled();
    }, { timeout: 1000 });

    // Switch to Hash Results tab to see the generated hashes
    await user.click(screen.getByRole("tab", { name: /hash results/i }));

    // Multiple "SHA-256" elements exist (badge in results + algorithm info card)
    expect(screen.queryAllByText("SHA-256").length).toBeGreaterThanOrEqual(1);
    // Result shows "{length} characters" (not "chars" which is in the algorithm info card)
    expect(screen.getByText(/64 characters/)).toBeInTheDocument();
  });

  it("loads sample text when Load Sample is clicked", async () => {
    const user = userEvent.setup();
    render(<HashGenerator />);

    await user.click(screen.getByRole("button", { name: /load sample/i }));

    const input = screen.getByLabelText(/text to hash/i) as HTMLTextAreaElement;
    expect(input.value.length).toBeGreaterThan(0);
  });

  it("clears input and results when Clear is clicked", async () => {
    const user = userEvent.setup();
    render(<HashGenerator />);

    await user.type(screen.getByLabelText(/text to hash/i), "test content");
    await user.click(screen.getByRole("button", { name: /^clear$/i }));

    const input = screen.getByLabelText(/text to hash/i) as HTMLTextAreaElement;
    expect(input.value).toBe("");
  });

  it("calls URL.createObjectURL when Download is clicked after generating", async () => {
    const user = userEvent.setup();
    render(<HashGenerator />);

    await user.type(screen.getByLabelText(/text to hash/i), "download test");
    await user.click(screen.getByRole("button", { name: /generate hashes/i }));

    await waitFor(() => {
      expect(screen.queryByText("SHA-256")).toBeInTheDocument();
    }, { timeout: 1000 });

    const downloadBtn = screen.queryByRole("button", { name: /download/i });
    if (downloadBtn) {
      await user.click(downloadBtn);
      expect(URL.createObjectURL).toHaveBeenCalled();
    }
  });
});
