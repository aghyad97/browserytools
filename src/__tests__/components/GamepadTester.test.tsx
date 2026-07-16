import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import GamepadTester from "@/components/GamepadTester";

// The tester is driven by the Gamepad API: we mock navigator.getGamepads to
// return a controllable snapshot, dispatch a real `gamepadconnected` event, and
// pump the rAF loop exactly one frame so the on-screen pad reflects the pad.
function makePad(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "Test Pad",
    index: 0,
    connected: true,
    mapping: "standard",
    buttons: [
      { pressed: true, value: 1, touched: true },
      { pressed: false, value: 0, touched: false },
    ],
    axes: [0.5, -0.5],
    vibrationActuator: { playEffect: vi.fn().mockResolvedValue("complete") },
    timestamp: 0,
    ...overrides,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let padList: any[] = [];

// Run the rAF callback exactly once, then stop — the pad-polling loop reschedules
// itself every frame, so a one-shot guard renders a single frame and halts.
function mockRafOnce() {
  let called = false;
  return vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((cb: FrameRequestCallback) => {
      if (!called) {
        called = true;
        cb(0);
      }
      return 1;
    });
}

function connect(pad: unknown) {
  padList = [pad];
  const evt = new Event("gamepadconnected");
  Object.defineProperty(evt, "gamepad", { value: pad });
  act(() => {
    window.dispatchEvent(evt);
  });
}

beforeEach(() => {
  padList = [];
  Object.defineProperty(navigator, "getGamepads", {
    value: () => padList,
    configurable: true,
    writable: true,
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GamepadTester", () => {
  it("renders inside the shell with a single h1 and the empty prompt before any pad connects", () => {
    mockRafOnce();
    render(<GamepadTester />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
    const empty = screen.getByTestId("gamepad-empty");
    expect(empty).toBeInTheDocument();
    expect(empty).toHaveTextContent("Connect a controller and press any button");
  });

  it("renders the connected pad id, per-button pressed state and axis values", () => {
    mockRafOnce();
    render(<GamepadTester />);
    expect(screen.getByTestId("gamepad-empty")).toBeInTheDocument();

    connect(makePad());

    // Pad id surfaces, empty prompt gone.
    expect(screen.queryByTestId("gamepad-empty")).not.toBeInTheDocument();
    expect(screen.getByText("Test Pad")).toBeInTheDocument();

    // Button 0 pressed, button 1 not.
    const b0 = document.querySelector('[data-testid="gamepad-button"][data-index="0"]');
    const b1 = document.querySelector('[data-testid="gamepad-button"][data-index="1"]');
    expect(b0).toHaveAttribute("data-pressed", "true");
    expect(b1).not.toHaveAttribute("data-pressed", "true");

    // Axes rendered to 4 decimals for drift checking.
    expect(screen.getByText("0.5000")).toBeInTheDocument();
    expect(screen.getByText("-0.5000")).toBeInTheDocument();
  });

  it("fires a dual-rumble effect when the vibration button is clicked", () => {
    mockRafOnce();
    render(<GamepadTester />);
    const pad = makePad();
    connect(pad);

    fireEvent.click(screen.getByTestId("gamepad-vibrate"));

    expect(pad.vibrationActuator.playEffect).toHaveBeenCalledWith(
      "dual-rumble",
      expect.objectContaining({
        duration: 500,
        strongMagnitude: 0.8,
        weakMagnitude: 0.4,
      })
    );
  });
});
