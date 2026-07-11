"use client";

/**
 * Shared slider-with-value row (R3 §F3 M4) — replaces the 23 hand-rolled
 * `Label (+ live value) + Slider` idioms where value placement/formatting
 * differed everywhere. Wraps the shared ui/slider (which inherits bt styling
 * via the F1 token bridge — we build on it, never fork it) and exposes a
 * single-number value/onChange instead of Radix's array API.
 *
 * `display` overrides the readout text (e.g. `formatBytes(value)` or `${value}px`);
 * otherwise the raw value is shown, tabular-num aligned.
 *
 * Colours via var(--bt-*); logical properties; both themes.
 */

import { useId, type ReactNode } from "react";
import { Slider } from "@/components/ui/slider";
import s from "./SliderRow.module.css";

export interface SliderRowProps {
  label: ReactNode;
  value: number;
  /** Readout override; defaults to the raw value. */
  display?: ReactNode;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function SliderRow({
  label,
  value,
  display,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  className,
  "data-testid": dataTestId,
}: SliderRowProps) {
  const id = useId();
  return (
    <div className={className ? `${s.row} ${className}` : s.row} data-testid={dataTestId}>
      <div className={s.head}>
        <label className={s.label} htmlFor={id}>
          {label}
        </label>
        <span className={s.value}>{display ?? value}</span>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  );
}
