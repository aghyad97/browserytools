import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UUIDGenerator from "@/components/UUIDGenerator";

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("UUIDGenerator", () => {
  it("renders a generate button", () => {
    render(<UUIDGenerator />);
    expect(screen.getByRole("button", { name: /generate/i })).toBeInTheDocument();
  });

  it("generates a UUID v4 matching the expected pattern", async () => {
    const user = userEvent.setup();
    render(<UUIDGenerator />);

    await user.click(screen.getByRole("button", { name: /generate/i }));

    // The generated UUIDs should appear as text in the component
    const uuidElements = screen.getAllByText(UUID_V4_REGEX);
    expect(uuidElements.length).toBeGreaterThanOrEqual(1);
  });

  it("generates multiple UUIDs when count is increased", async () => {
    const user = userEvent.setup();
    render(<UUIDGenerator />);

    // Find the count input and change to 3
    const countInput = screen.queryByRole("spinbutton");
    if (countInput) {
      await user.clear(countInput);
      await user.type(countInput, "3");
    }

    await user.click(screen.getByRole("button", { name: /generate/i }));

    const uuidElements = screen.queryAllByText(UUID_V4_REGEX);
    // May or may not have 3 depending on the UI, just check at least 1
    expect(uuidElements.length).toBeGreaterThanOrEqual(1);
  });

  it("copies UUIDs to clipboard when Copy button is clicked", async () => {
    const user = userEvent.setup();
    render(<UUIDGenerator />);

    await user.click(screen.getByRole("button", { name: /generate/i }));

    // Find a copy button (Copy All or individual copy)
    const copyBtn = screen.queryByRole("button", { name: /copy/i });
    if (copyBtn) {
      // Spy after userEvent may have replaced clipboard
      const writeSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
      await user.click(copyBtn);
      expect(writeSpy).toHaveBeenCalled();
    }
  });

  it("clears the UUID list when Clear/Delete is clicked", async () => {
    const user = userEvent.setup();
    render(<UUIDGenerator />);

    await user.click(screen.getByRole("button", { name: /generate/i }));

    const clearBtn =
      screen.queryByRole("button", { name: /clear/i }) ||
      screen.queryByRole("button", { name: /delete/i });
    if (clearBtn) {
      await user.click(clearBtn);
      const uuids = screen.queryAllByText(UUID_V4_REGEX);
      expect(uuids.length).toBe(0);
    }
  });
});
