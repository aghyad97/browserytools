"use client";

/**
 * Shared signature surface extracted from SignatureMaker (byte-parity).
 *
 * The pad owns canvas + pointer logic + rendering; the PARENT owns all knobs
 * (mode, pen/type colours, widths, text, font, size) AND the committed `strokes`
 * array, so the parent stays the single source of truth. Strokes are lifted
 * (controlled prop + `onStrokesChange`) rather than kept internal: SignatureMaker
 * already reads them for SVG export and undo/clear button state, so a controlled
 * array is the minimal-churn direction and keeps the handle exactly
 * `{ getBlob, clear, isEmpty }` (no `getStrokes()` accessor needed).
 *
 * `data-testid="signature-canvas"` stays on the same canvas element; type mode
 * renders no visible surface (the parent keeps its own `signature-preview` span)
 * and `getBlob()` reproduces the offscreen typed-name render verbatim.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { canvasToBlob } from "@/lib/image/canvas";

// A single freehand stroke is a list of points captured between pointerdown and pointerup.
export interface Point {
  x: number;
  y: number;
}
export type Stroke = {
  points: Point[];
  color: string;
  width: number;
};

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 220;

export interface SignaturePadHandle {
  getBlob(): Promise<Blob | null>;
  clear(): void;
  isEmpty(): boolean;
}

export interface SignaturePadProps {
  mode: "draw" | "type";
  // ── draw mode (controlled by parent) ──
  strokes?: Stroke[];
  onStrokesChange?: (strokes: Stroke[]) => void;
  penColor?: string;
  penWidth?: number;
  // ── type mode ──
  text?: string;
  font?: string;
  fontSize?: number;
  color?: string;
}

function SignaturePadInner(
  {
    mode,
    strokes = [],
    onStrokesChange,
    penColor = "#1d4ed8",
    penWidth = 3,
    text = "",
    font = "cursive",
    fontSize = 64,
    color = "#1d4ed8",
  }: SignaturePadProps,
  ref: React.Ref<SignaturePadHandle>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentStroke = useRef<Stroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Draw all committed strokes (plus an optional in-progress one) onto the canvas
  // over a transparent background, with smooth quadratic-curve interpolation.
  const renderStrokes = useCallback(
    (extra?: Stroke | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const all = extra ? [...strokes, extra] : strokes;
      for (const stroke of all) {
        const pts = stroke.points;
        if (pts.length === 0) continue;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        if (pts.length === 1) {
          // A single tap renders as a dot.
          ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
        } else {
          for (let i = 1; i < pts.length - 1; i++) {
            const midX = (pts[i].x + pts[i + 1].x) / 2;
            const midY = (pts[i].y + pts[i + 1].y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
          }
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y);
        }
        ctx.stroke();
      }
    },
    [strokes],
  );

  useEffect(() => {
    if (mode !== "draw") return;
    renderStrokes();
  }, [mode, renderStrokes]);

  // Translate a pointer event into canvas coordinate space, accounting for the
  // CSS-vs-backing-store size difference.
  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    const stroke: Stroke = {
      points: [getPoint(e)],
      color: penColor,
      width: penWidth,
    };
    currentStroke.current = stroke;
    setIsDrawing(true);
    renderStrokes(stroke);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke.current) return;
    e.preventDefault();
    currentStroke.current.points.push(getPoint(e));
    renderStrokes(currentStroke.current);
  };

  const handlePointerUp = () => {
    if (!currentStroke.current) return;
    // Capture the finished stroke before nulling the ref: the parent updater
    // runs after this handler returns (React 18 batching), by which point the ref
    // is already null — reading it inside the updater would push null into state.
    const finished = currentStroke.current;
    onStrokesChange?.([...strokes, finished]);
    currentStroke.current = null;
    setIsDrawing(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      isEmpty() {
        return mode === "draw" ? strokes.length === 0 : text.trim().length === 0;
      },
      clear() {
        currentStroke.current = null;
        if (mode === "draw") {
          onStrokesChange?.([]);
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      },
      async getBlob() {
        if (mode === "draw") {
          const canvas = canvasRef.current;
          if (!canvas) return null;
          return canvasToBlob(canvas);
        }
        // Type mode: render the typed name to an offscreen canvas with a
        // transparent background, then encode as PNG.
        const canvas = document.createElement("canvas");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontSize}px ${font}`;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        return canvasToBlob(canvas);
      },
    }),
    [mode, strokes, onStrokesChange, text, font, fontSize, color],
  );

  if (mode !== "draw") return null;

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      data-testid="signature-canvas"
      className="w-full h-auto touch-none cursor-crosshair"
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}

export const SignaturePad = forwardRef(SignaturePadInner) as ForwardRefExoticComponent<
  SignaturePadProps & RefAttributes<SignaturePadHandle>
>;
