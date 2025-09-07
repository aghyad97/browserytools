"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

type ValueSliderProps = {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  suffix?: string;
};

export function ValueSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled,
  suffix,
}: ValueSliderProps) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => Math.round(v / step) * step;
  const percent = max === min ? 0 : (value - min) / (max - min);

  const setFromPointer = (e: PointerEvent | React.PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : 0) - rect.left;
    const p = Math.min(1, Math.max(0, x / rect.width));
    const raw = min + p * (max - min);
    const next = clamp(snap(raw));
    onChange(next);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromPointer(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || disabled) return;
    setFromPointer(e);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(clamp(value - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(clamp(value + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(min);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(max);
    }
  };

  const handleXStyle = { left: `${Math.round(percent * 100)}%` } as React.CSSProperties;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium leading-none">{label}</span>
          <span className="text-xs text-muted-foreground">
            {value}
            {suffix}
          </span>
        </div>
      ) : null}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
          <div
            ref={trackRef}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onDoubleClick={() => onChange(0)}
            className={cn(
              "relative h-10 w-full select-none rounded-xl ring-1 ring-border overflow-hidden",
              disabled ? "opacity-50" : "cursor-pointer",
              "bg-background/70"
            )}
          >
            {/* Left filled section */}
            <div
              className="absolute left-0 top-0 h-full rounded-l-xl bg-muted"
              style={{ width: `${Math.max(0, Math.min(100, percent * 100))}%` }}
            />
            {/* Right shadowed section */}
            <div className="pointer-events-none absolute inset-0 rounded-xl shadow-inner" />
            {/* Handle (thin divider) */}
            <div
              className="absolute top-1/2 h-9 w-1 -translate-y-1/2 rounded bg-foreground/60 shadow-sm"
              style={handleXStyle}
            />
            {/* Inline labels */}
            {label ? (
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {label}
              </div>
            ) : null}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {value}
              {suffix}
            </div>
          </div>
          </TooltipTrigger>
          <TooltipContent side="top">Double-click to reset to 0</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
