"use client";

/**
 * Reusable canvas spin wheel. All angle/rotation math is delegated to
 * `@/lib/wheel` — this component only draws and animates.
 *
 * Drawing convention (must match `src/lib/wheel.ts`'s geometry doc comment):
 * - We translate to the wheel's center, then rotate by a constant
 *   `-Math.PI / 2` base offset plus the current `rotation`. That base offset
 *   is purely cosmetic — it makes local angle 0 point at the physical top of
 *   the canvas when `rotation === 0`, so the wheel "looks right" — and it
 *   cancels out of the landed-segment algebra because the pointer graphic is
 *   drawn at that exact same physical location (the fixed top of the
 *   canvas), so both sides of wheel.ts's equation shift by the same amount.
 * - Segment `i` is drawn with `ctx.arc(0, 0, r, i * segAngle, (i + 1) *
 *   segAngle)` using the default (non-anticlockwise) sweep direction, i.e.
 *   increasing angle sweeps in the same rotational direction that positive
 *   `ctx.rotate(rotation)` applies. This matches wheel.ts's convention that
 *   rotation is "clockwise-positive, matching canvas ctx.rotate".
 * - The pointer is drawn fixed at the physical top of the canvas, outside
 *   the rotate transform, matching wheel.ts's "pointer fixed at world angle
 *   0 ('top')".
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  indexAtPointer,
  segmentAngle,
  segmentColor,
  targetRotation,
} from "@/lib/wheel";

const SPIN_DURATION_MS = 4000;
const SPIN_TURNS = 5;
const BASE_OFFSET = -Math.PI / 2;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export interface SpinWheelProps {
  /** Segment labels, in wheel.ts's index order (segment 0 first, clockwise). */
  labels: string[];
  /** Called with the landed segment index once the wheel comes to rest. */
  onResult: (index: number) => void;
  /** External busy flag (e.g. parent-owned state) — disables the spin button. */
  spinning?: boolean;
  /** Called synchronously when a spin is kicked off. */
  onSpinStart?: () => void;
  /** Injectable RNG for deterministic tests; defaults to Math.random. */
  rng?: () => number;
  /** Canvas size in CSS pixels (square). */
  size?: number;
  className?: string;
  /**
   * Label for the built-in spin button. This is a low-level, tool-agnostic
   * component (no next-intl dependency), so callers own localization by
   * passing a translated string here.
   */
  spinLabel?: string;
}

export function SpinWheel({
  labels,
  onResult,
  spinning: externalSpinning,
  onSpinStart,
  rng = Math.random,
  size = 320,
  className,
  spinLabel = "Spin",
}: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const count = labels.length;

  const draw = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (count === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const segAngle = segmentAngle(count);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 4;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(BASE_OFFSET + rotation);

      for (let i = 0; i < count; i++) {
        const start = i * segAngle;
        const end = start + segAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = segmentColor(i);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.stroke();

        ctx.save();
        ctx.rotate(start + segAngle / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.font = "14px sans-serif";
        ctx.fillText(labels[i] ?? "", radius - 10, 0);
        ctx.restore();
      }

      ctx.restore();

      // Pointer, fixed at the physical top of the canvas (world angle 0).
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - radius - 2);
      ctx.lineTo(cx + 10, cy - radius - 2);
      ctx.lineTo(cx, cy - radius + 16);
      ctx.closePath();
      ctx.fillStyle = "#111827";
      ctx.fill();
    },
    [count, labels],
  );

  // Re-draw whenever the label set (and therefore segment geometry) changes.
  useEffect(() => {
    draw(rotationRef.current);
  }, [draw]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || count === 0) return;

    const targetIndex = Math.min(count - 1, Math.floor(rng() * count));
    const start = rotationRef.current;
    const target = targetRotation(start, targetIndex, count, SPIN_TURNS);

    onSpinStart?.();
    setIsSpinning(true);

    const finish = () => {
      rotationRef.current = target;
      draw(target);
      setIsSpinning(false);
      onResult(indexAtPointer(target, count));
    };

    if (prefersReducedMotion()) {
      // Snap straight to the result — draw the final frame with no
      // animation — but still resolve onResult on the next tick rather than
      // synchronously within this click/call stack, so callers get
      // consistent (always-async) timing regardless of motion preference.
      rotationRef.current = target;
      draw(target);
      setTimeout(finish, 0);
      return;
    }

    const startTime =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / SPIN_DURATION_MS, 1);
      const eased = easeOutCubic(t);
      const rotation = start + (target - start) * eased;
      rotationRef.current = rotation;
      draw(rotation);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        finish();
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [count, isSpinning, rng, draw, onResult, onSpinStart]);

  const disabled = isSpinning || Boolean(externalSpinning) || count === 0;

  const canvasStyle = useMemo(
    () => ({ width: size, height: size, aspectRatio: "1 / 1" }),
    [size],
  );

  return (
    <div className={className} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        data-testid="spin-wheel-canvas"
        style={canvasStyle}
      />
      <Button
        type="button"
        data-testid="spin"
        onClick={spin}
        disabled={disabled}
      >
        {spinLabel}
      </Button>
    </div>
  );
}
