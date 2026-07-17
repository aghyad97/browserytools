import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WheelOfNames from "@/components/WheelOfNames";

// SpinWheel animates via requestAnimationFrame unless reduced motion is on,
// in which case it resolves synchronously (see SpinWheel.test.tsx). Force it
// on here so onResult fires deterministically without waiting on rAF frames.
function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    writable: true,
    configurable: true,
  });
}

async function typeNames(user: ReturnType<typeof userEvent.setup>, names: string[]) {
  const textarea = screen.getByTestId("wheel-names-input");
  await user.click(textarea);
  await user.paste(names.join("\n"));
}

describe("WheelOfNames", () => {
  beforeEach(() => {
    mockReducedMotion(true);
  });

  afterEach(() => {
    mockReducedMotion(false);
  });

  it("parses one name per line, stripping blank lines, into wheel labels", async () => {
    const user = userEvent.setup();
    render(<WheelOfNames />);

    await typeNames(user, ["Alice", "", "Bob", "  ", "Charlie"]);

    expect(screen.getByTestId("wheel-names-count")).toHaveTextContent("3");
    expect(screen.getByTestId("spin-wheel-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("spin")).not.toBeDisabled();
  });

  it("shows the rng-chosen winner after a spin", async () => {
    const user = userEvent.setup();
    // rng() = 0 with 3 labels forces index 0 -> "Alice".
    render(<WheelOfNames rng={() => 0} />);

    await typeNames(user, ["Alice", "Bob", "Charlie"]);
    await user.click(screen.getByTestId("spin"));

    await waitFor(() =>
      expect(screen.getByTestId("wheel-winner")).toBeInTheDocument(),
    );
    expect(screen.getByTestId("wheel-winner")).toHaveTextContent("Alice");
  });

  it("removes the winner from the list when remove-winner-after-spin is on", async () => {
    const user = userEvent.setup();
    render(<WheelOfNames rng={() => 0} />);

    await typeNames(user, ["Alice", "Bob", "Charlie"]);
    await user.click(screen.getByTestId("spin"));

    await waitFor(() =>
      expect(screen.getByTestId("wheel-winner")).toHaveTextContent("Alice"),
    );
    expect(screen.getByTestId("wheel-names-count")).toHaveTextContent("2");
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("does not remove the winner when remove-winner-after-spin is off", async () => {
    const user = userEvent.setup();
    render(<WheelOfNames rng={() => 0} />);

    await typeNames(user, ["Alice", "Bob", "Charlie"]);
    await user.click(screen.getByTestId("remove-winner-checkbox"));
    await user.click(screen.getByTestId("spin"));

    await waitFor(() =>
      expect(screen.getByTestId("wheel-winner")).toHaveTextContent("Alice"),
    );
    expect(screen.getByTestId("wheel-names-count")).toHaveTextContent("3");
  });

  it("shuffles the list order via the shuffle control", async () => {
    const user = userEvent.setup();
    render(<WheelOfNames />);

    await typeNames(user, ["Alice", "Bob", "Charlie"]);
    await user.click(screen.getByTestId("shuffle-names"));

    // Shuffle re-orders in place; the set of names is unchanged.
    expect(screen.getByTestId("wheel-names-count")).toHaveTextContent("3");
    const textarea = screen.getByTestId("wheel-names-input") as HTMLTextAreaElement;
    const names = textarea.value.split("\n").map((n) => n.trim()).filter(Boolean);
    expect(names.sort()).toEqual(["Alice", "Bob", "Charlie"]);
  });
});
