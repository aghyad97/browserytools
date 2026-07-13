import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timer from "@/components/Timer";

// The five-zone ToolShell pilot (interactive archetype). Drive the real flow:
// Start/Pause toggle via the shell primary action + countdown apply.
// playBeep touches AudioContext (absent in happy-dom) — mock it out.
vi.mock("@/lib/time-format", () => ({
  playBeep: vi.fn(),
}));

// NumberFlow renders a custom element whose lifecycle hooks (willUpdate) are
// absent in happy-dom and throw when the displayed value changes. Render it as
// a plain span for the test.
vi.mock("@number-flow/react", () => ({
  default: ({ value }: { value: number }) => <span>{value}</span>,
}));

// The running timer drives a requestAnimationFrame loop that re-renders
// NumberFlow every frame; left live it re-enters React's scheduler during
// userEvent ("Should not already be working"). Stub rAF to a no-op so state
// transitions are deterministic without the animation loop.
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Timer (ToolShell pilot)", () => {
  it("renders inside the shell with exactly one h1", () => {
    render(<Timer />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
  });

  it("toggles Start/Pause through the shell primary action", async () => {
    const user = userEvent.setup();
    render(<Timer />);

    const primary = screen.getByTestId("tool-shell-primary");
    expect(primary).toHaveTextContent("Start");

    await user.click(primary);
    expect(primary).toHaveTextContent("Pause");
    const { playBeep } = await import("@/lib/time-format");
    expect(playBeep).toHaveBeenCalled();

    await user.click(primary);
    expect(primary).toHaveTextContent("Start");
  });

  it("applies a custom countdown and stays paused", async () => {
    const user = userEvent.setup();
    render(<Timer />);

    // hours / minutes / seconds number inputs (role spinbutton), in order.
    const minutes = screen.getAllByRole("spinbutton")[1] as HTMLInputElement;
    await user.clear(minutes);
    await user.type(minutes, "10");
    expect(minutes.value).toBe("10");

    await user.click(screen.getByRole("button", { name: /apply/i }));
    // Applying a countdown resets to a paused state (primary shows Start).
    expect(screen.getByTestId("tool-shell-primary")).toHaveTextContent("Start");
  });
});
