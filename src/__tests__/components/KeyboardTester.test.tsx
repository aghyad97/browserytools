import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import KeyboardTester from "@/components/KeyboardTester";

// The board is keyboard-driven: we drive real window keydown/keyup events and
// assert the on-screen key caps and stats reflect them.
function keyCap(code: string): HTMLElement | null {
  return document.querySelector(`[data-code="${code}"]`);
}

describe("KeyboardTester", () => {
  it("renders inside the shell with a single h1 and a prompt", () => {
    render(<KeyboardTester />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
    // The physical board is present and pinned LTR.
    const board = screen.getByTestId("keyboard-board");
    expect(board).toBeInTheDocument();
    expect(board).toHaveAttribute("dir", "ltr");
  });

  it("marks a key pressed on keydown and tested on keyup", () => {
    render(<KeyboardTester />);
    const a = keyCap("KeyA");
    expect(a).toBeInTheDocument();
    expect(a).not.toHaveAttribute("data-pressed", "true");

    fireEvent.keyDown(window, { code: "KeyA" });
    expect(keyCap("KeyA")).toHaveAttribute("data-pressed", "true");

    fireEvent.keyUp(window, { code: "KeyA" });
    expect(keyCap("KeyA")).not.toHaveAttribute("data-pressed", "true");
    expect(keyCap("KeyA")).toHaveAttribute("data-tested", "true");
  });

  it("increments the tested count and tracks rollover for held keys", () => {
    render(<KeyboardTester />);
    expect(screen.getByTestId("stat-tested")).toHaveTextContent(/^0\//);

    fireEvent.keyDown(window, { code: "KeyA" });
    expect(screen.getByTestId("stat-tested")).toHaveTextContent(/^1\//);
    expect(screen.getByTestId("stat-rollover")).toHaveTextContent("1");

    // Hold a second key: rollover (currently held) becomes 2.
    fireEvent.keyDown(window, { code: "KeyB" });
    expect(screen.getByTestId("stat-tested")).toHaveTextContent(/^2\//);
    expect(screen.getByTestId("stat-rollover")).toHaveTextContent("2");
    expect(screen.getByTestId("stat-max")).toHaveTextContent("2");

    // Releasing one drops current rollover but leaves the max at its peak.
    fireEvent.keyUp(window, { code: "KeyA" });
    expect(screen.getByTestId("stat-rollover")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-max")).toHaveTextContent("2");
  });

  it("counts an unknown event.code as tested without crashing", () => {
    render(<KeyboardTester />);
    fireEvent.keyDown(window, { code: "LaunchMail" });
    fireEvent.keyUp(window, { code: "LaunchMail" });
    expect(screen.getByTestId("stat-tested")).toHaveTextContent(/^1\//);
  });

  it("reset clears pressed, tested, history and rollover", () => {
    render(<KeyboardTester />);
    fireEvent.keyDown(window, { code: "KeyA" });
    fireEvent.keyUp(window, { code: "KeyA" });
    fireEvent.keyDown(window, { code: "KeyB" });
    expect(screen.getByTestId("stat-tested")).toHaveTextContent(/^2\//);

    fireEvent.click(screen.getByTestId("tool-shell-primary"));

    expect(screen.getByTestId("stat-tested")).toHaveTextContent(/^0\//);
    expect(screen.getByTestId("stat-rollover")).toHaveTextContent("0");
    expect(screen.getByTestId("stat-max")).toHaveTextContent("0");
    expect(keyCap("KeyA")).not.toHaveAttribute("data-tested", "true");
    expect(keyCap("KeyB")).not.toHaveAttribute("data-pressed", "true");
  });
});
