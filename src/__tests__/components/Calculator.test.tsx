import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Calculator from "@/components/Calculator";

// function-plot manipulates the DOM via d3/SVG which is heavy and unreliable in
// happy-dom. Mock it so the graphing tab can render and we can assert it was
// invoked with the user's functions.
const functionPlot = vi.fn();
vi.mock("function-plot", () => ({
  default: (...args: unknown[]) => functionPlot(...args),
}));

beforeEach(() => {
  functionPlot.mockClear();
});

describe("Calculator", () => {
  it("renders all three modes and defaults to basic", () => {
    render(<Calculator />);
    expect(screen.getByRole("tab", { name: /basic/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /scientific/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /graphing/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /basic/i })).toHaveAttribute(
      "data-state",
      "active"
    );
  });

  it("performs a basic arithmetic calculation (2 + 3 = 5)", async () => {
    const user = userEvent.setup();
    const { container } = render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    // The large display should show the result.
    const display = container.querySelector(".text-4xl");
    expect(display?.textContent).toBe("5");
  });

  it("evaluates scientific functions: sin(30) in degrees ≈ 0.5", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("tab", { name: /scientific/i }));

    const input = screen.getByLabelText(/expression/i);
    await user.type(input, "sin(30)");

    await waitFor(() => {
      const result = screen.getByTestId("sci-result");
      expect(parseFloat(result.textContent || "")).toBeCloseTo(0.5, 6);
    });
  });

  it("evaluates a logarithm: log10(1000) = 3", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("tab", { name: /scientific/i }));
    const input = screen.getByLabelText(/expression/i);
    await user.type(input, "log10(1000)");

    await waitFor(() => {
      expect(parseFloat(screen.getByTestId("sci-result").textContent || "")).toBeCloseTo(
        3,
        6
      );
    });
  });

  it("evaluates a factorial: 5! = 120", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("tab", { name: /scientific/i }));
    const input = screen.getByLabelText(/expression/i);
    await user.type(input, "5!");

    await waitFor(() => {
      expect(screen.getByTestId("sci-result").textContent).toBe("120");
    });
  });

  it("shows an error for an invalid scientific expression on equals", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("tab", { name: /scientific/i }));
    const input = screen.getByLabelText(/expression/i);
    await user.type(input, "2 ++ )");
    await user.click(screen.getByRole("button", { name: "=" }));

    await waitFor(() => {
      expect(screen.getByTestId("sci-result").textContent).toBe("Error");
    });
  });

  it("switches angle mode and re-evaluates (sin(90) rad ≈ 0.8939)", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("tab", { name: /scientific/i }));
    const input = screen.getByLabelText(/expression/i);
    await user.type(input, "sin(90)");

    // Degrees default: sin(90) = 1
    await waitFor(() => {
      expect(parseFloat(screen.getByTestId("sci-result").textContent || "")).toBeCloseTo(
        1,
        6
      );
    });

    await user.click(screen.getByRole("button", { name: "Rad" }));
    await waitFor(() => {
      expect(parseFloat(screen.getByTestId("sci-result").textContent || "")).toBeCloseTo(
        0.8939,
        3
      );
    });
  });

  it("renders the graphing tab and plots the default function", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("tab", { name: /graphing/i }));

    expect(screen.getByTestId("graph-canvas")).toBeInTheDocument();
    // The default x^2 function should have been handed to function-plot.
    await waitFor(() => expect(functionPlot).toHaveBeenCalled());
    const call = functionPlot.mock.calls.at(-1)?.[0] as {
      data: { fn: string }[];
    };
    expect(call.data.some((d) => d.fn === "x^2")).toBe(true);
  });

  it("adds and removes functions in the graphing tab", async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.click(screen.getByRole("tab", { name: /graphing/i }));

    const panel = screen.getByRole("tabpanel");
    const fnInputs = () =>
      within(panel)
        .getAllByLabelText(/function/i)
        .filter((el) => el.tagName === "INPUT");
    expect(fnInputs()).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /add function/i }));
    expect(fnInputs()).toHaveLength(2);
  });
});
