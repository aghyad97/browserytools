import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RandomPicker from "@/components/RandomPicker";

// The component prefers crypto.getRandomValues (with modulo rejection) and
// falls back to Math.random. To make output deterministic we stub both:
//  - getRandomValues fills the buffer with a fixed value
//  - Math.random returns a fixed fraction
// `cryptoValue` is the raw uint32 written into the buffer; the component maps it
// to a number in [min,max] via `min + (value % range)`.
function stubRandom(cryptoValue: number, mathValue = 0) {
  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
    (arr: ArrayBufferView | null) => {
      const view = arr as Uint32Array;
      for (let i = 0; i < view.length; i++) view[i] = cryptoValue;
      return arr as never;
    }
  );
  vi.spyOn(Math, "random").mockReturnValue(mathValue);
}

describe("RandomPicker", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders all four tabs", () => {
    render(<RandomPicker />);
    expect(screen.getByRole("tab", { name: /number/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /dice/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /coin/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /list/i })).toBeInTheDocument();
  });

  it("generates a random number that respects min/max", async () => {
    // range = 10-20 (11 values). cryptoValue % 11 with cryptoValue=3 → 3 → 10+3 = 13.
    stubRandom(3);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RandomPicker />);

    const min = screen.getByLabelText(/min/i);
    const max = screen.getByLabelText(/max/i);
    await user.clear(min);
    await user.type(min, "10");
    await user.clear(max);
    await user.type(max, "20");

    await user.click(screen.getByRole("button", { name: /generate/i }));

    const results = screen.getByTestId("rp-number-results");
    const value = Number(results.textContent);
    expect(value).toBeGreaterThanOrEqual(10);
    expect(value).toBeLessThanOrEqual(20);
    expect(value).toBe(13);
  });

  it("shows an error when min is greater than max", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RandomPicker />);

    const min = screen.getByLabelText(/min/i);
    const max = screen.getByLabelText(/max/i);
    await user.clear(min);
    await user.type(min, "50");
    await user.clear(max);
    await user.type(max, "10");

    await user.click(screen.getByRole("button", { name: /generate/i }));
    expect(toast.error).toHaveBeenCalled();
  });

  it("rolls dice and renders each die plus the total", async () => {
    // d6, cryptoValue=2 → randomInt(1,6) = 1 + (2 % 6) = 3 per die.
    stubRandom(2);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RandomPicker />);

    await user.click(screen.getByRole("tab", { name: /dice/i }));

    const diceCount = screen.getByLabelText(/number of dice/i);
    await user.clear(diceCount);
    await user.type(diceCount, "2");

    await user.click(screen.getByRole("button", { name: /roll dice/i }));

    const dice = screen.getAllByTestId("rp-die");
    expect(dice).toHaveLength(2);
    dice.forEach((d) => expect(d.textContent).toBe("3"));

    expect(screen.getByTestId("rp-dice-total").textContent).toBe("6");
  });

  it("flips a coin and increments the running tally", async () => {
    // randomInt(0,1) = 0 + (cryptoValue % 2). cryptoValue=0 → 0 → heads.
    stubRandom(0);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RandomPicker />);

    await user.click(screen.getByRole("tab", { name: /coin/i }));
    await user.click(screen.getByRole("button", { name: /flip coin/i }));

    // Advance past the 600ms flip animation timeout.
    await vi.advanceTimersByTimeAsync(700);

    await waitFor(() =>
      expect(screen.getByTestId("rp-heads-tally").textContent).toBe("1")
    );
    expect(screen.getByTestId("rp-tails-tally").textContent).toBe("0");
    expect(screen.getByTestId("rp-coin").textContent).toMatch(/heads/i);
  });

  it("points the List tab to the Wheel of Names tool instead of picking a winner", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<RandomPicker />);

    await user.click(screen.getByRole("tab", { name: /list/i }));

    const link = screen.getByRole("link", { name: /wheel of names/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tools/wheel-of-names");
  });
});
