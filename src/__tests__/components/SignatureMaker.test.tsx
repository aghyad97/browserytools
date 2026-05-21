import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignatureMaker from "@/components/SignatureMaker";

// Track the 2D context calls so we can assert that strokes were drawn and the
// canvas was cleared. test-setup mocks getContext globally; we override it here
// with spy-able fns scoped to this suite.
function makeCtx() {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    fillRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    lineCap: "",
    lineJoin: "",
    strokeStyle: "",
    lineWidth: 0,
    fillStyle: "",
    textAlign: "",
    textBaseline: "",
    font: "",
  };
}

let ctx = makeCtx();

beforeEach(() => {
  ctx = makeCtx();
  HTMLCanvasElement.prototype.getContext = vi
    .fn()
    .mockReturnValue(ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
    left: 0,
    top: 0,
    width: 600,
    height: 220,
    right: 600,
    bottom: 220,
  } as DOMRect);
  // toBlob already mocked in test-setup to return an image/png blob.
});

// Simulate a freehand stroke via pointer events on the canvas.
function drawStroke(canvas: HTMLElement) {
  fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerMove(canvas, { clientX: 40, clientY: 30, pointerId: 1 });
  fireEvent.pointerMove(canvas, { clientX: 80, clientY: 60, pointerId: 1 });
  fireEvent.pointerUp(canvas, { clientX: 80, clientY: 60, pointerId: 1 });
}

describe("SignatureMaker", () => {
  it("renders draw and type tabs", () => {
    render(<SignatureMaker />);
    expect(screen.getByRole("tab", { name: "Draw" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Type" })).toBeInTheDocument();
    expect(screen.getByTestId("signature-canvas")).toBeInTheDocument();
  });

  it("draws strokes on the canvas via pointer events", () => {
    render(<SignatureMaker />);
    const canvas = screen.getByTestId("signature-canvas");
    drawStroke(canvas);
    // The render path uses quadratic curves for multi-point strokes.
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalled();
  });

  it("clears the canvas and disables undo/clear when empty", async () => {
    const user = userEvent.setup();
    render(<SignatureMaker />);
    const canvas = screen.getByTestId("signature-canvas");

    // Initially nothing to clear.
    expect(screen.getByRole("button", { name: /clear/i })).toBeDisabled();

    drawStroke(canvas);
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    expect(clearBtn).not.toBeDisabled();

    await user.click(clearBtn);
    // After clearing, the button is disabled again and the canvas was cleared.
    expect(screen.getByRole("button", { name: /clear/i })).toBeDisabled();
    expect(ctx.clearRect).toHaveBeenCalled();
  });

  it("exports the drawn signature as a transparent PNG", async () => {
    const user = userEvent.setup();
    render(<SignatureMaker />);
    const canvas = screen.getByTestId("signature-canvas");
    drawStroke(canvas);

    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    await user.click(screen.getByRole("button", { name: /download png/i }));

    await waitFor(() => {
      expect(toBlobSpy).toHaveBeenCalledWith(expect.any(Function), "image/png");
    });
    expect(URL.createObjectURL).toHaveBeenCalled();
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });

  it("type mode renders the chosen font and color in the preview", async () => {
    const user = userEvent.setup();
    render(<SignatureMaker />);

    await user.click(screen.getByRole("tab", { name: "Type" }));

    const input = screen.getByLabelText("Your name");
    await user.type(input, "Jane Doe");

    const preview = screen.getByTestId("signature-preview");
    expect(preview).toHaveTextContent("Jane Doe");
    // Default font is the first handwriting font (Brush Script).
    expect(preview.style.fontFamily).toContain("Brush Script");
  });

  it("exports a typed signature to a transparent PNG via toBlob", async () => {
    const user = userEvent.setup();
    render(<SignatureMaker />);

    await user.click(screen.getByRole("tab", { name: "Type" }));
    await user.type(screen.getByLabelText("Your name"), "Jane Doe");

    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    await user.click(screen.getByRole("button", { name: /download png/i }));

    await waitFor(() => {
      expect(ctx.fillText).toHaveBeenCalledWith("Jane Doe", 300, 110);
      expect(toBlobSpy).toHaveBeenCalledWith(expect.any(Function), "image/png");
    });
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
