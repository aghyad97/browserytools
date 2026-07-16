import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useState } from "react";
import {
  SignaturePad,
  type SignaturePadHandle,
  type Stroke,
} from "@/components/shared/SignaturePad";

// Mirror SignatureMaker.test.tsx's canvas ctx + getBoundingClientRect setup so
// the extracted pad exercises the identical drawing path.
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

// A controlled draw-mode host that owns strokes state (as SignatureMaker does)
// and forwards a ref so the test can drive the imperative handle.
function DrawHarness({ handleRef }: { handleRef: React.RefObject<SignaturePadHandle> }) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  return (
    <SignaturePad
      ref={handleRef}
      mode="draw"
      strokes={strokes}
      onStrokesChange={setStrokes}
      penColor="#1d4ed8"
      penWidth={3}
    />
  );
}

function drawStroke(canvas: HTMLElement) {
  fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerMove(canvas, { clientX: 40, clientY: 30, pointerId: 1 });
  fireEvent.pointerMove(canvas, { clientX: 80, clientY: 60, pointerId: 1 });
  fireEvent.pointerUp(canvas, { clientX: 80, clientY: 60, pointerId: 1 });
}

describe("SignaturePad", () => {
  it("renders a canvas with the shared testid in draw mode", () => {
    const ref = { current: null } as React.RefObject<SignaturePadHandle>;
    render(<DrawHarness handleRef={ref} />);
    expect(screen.getByTestId("signature-canvas")).toBeInTheDocument();
    expect(ref.current?.isEmpty()).toBe(true);
  });

  it("becomes non-empty after a pointer-drawn stroke", () => {
    const ref = { current: null } as React.RefObject<SignaturePadHandle>;
    render(<DrawHarness handleRef={ref} />);
    const canvas = screen.getByTestId("signature-canvas");
    drawStroke(canvas);
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalled();
    expect(ref.current?.isEmpty()).toBe(false);
  });

  it("resolves a Blob from getBlob() after drawing", async () => {
    const ref = { current: null } as React.RefObject<SignaturePadHandle>;
    render(<DrawHarness handleRef={ref} />);
    const canvas = screen.getByTestId("signature-canvas");
    drawStroke(canvas);
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    const blob = await ref.current!.getBlob();
    expect(blob).toBeInstanceOf(Blob);
    expect(toBlobSpy).toHaveBeenCalledWith(expect.any(Function), "image/png", undefined);
  });

  it("clear() empties the pad and clears the canvas", async () => {
    const ref = { current: null } as React.RefObject<SignaturePadHandle>;
    render(<DrawHarness handleRef={ref} />);
    const canvas = screen.getByTestId("signature-canvas");
    drawStroke(canvas);
    expect(ref.current?.isEmpty()).toBe(false);

    await act(async () => {
      ref.current!.clear();
    });

    expect(ref.current?.isEmpty()).toBe(true);
    expect(ctx.clearRect).toHaveBeenCalled();
  });

  it("type mode: getBlob renders the typed name to an offscreen canvas", async () => {
    const ref = { current: null } as React.RefObject<SignaturePadHandle>;
    render(
      <SignaturePad
        ref={ref}
        mode="type"
        text="Jane Doe"
        font="'Brush Script MT', cursive"
        fontSize={64}
        color="#1d4ed8"
      />,
    );
    expect(ref.current?.isEmpty()).toBe(false);
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    const blob = await ref.current!.getBlob();
    expect(blob).toBeInstanceOf(Blob);
    expect(ctx.fillText).toHaveBeenCalledWith("Jane Doe", 300, 110);
    expect(toBlobSpy).toHaveBeenCalledWith(expect.any(Function), "image/png", undefined);
  });
});
