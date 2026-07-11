"use client";

/**
 * Shared segmented mode picker (R3 §F3 M6) — one idiom for the 38 places that
 * used `Tabs`/`TabsList` (or a hand-rolled button group) purely as a mode
 * switch (output format, result tab). A sliding active indicator gives it the
 * segmented look; the slide is pure CSS (translateX on a --active var) and is
 * gated behind prefers-reduced-motion. NOT framer.
 *
 * Semantics: a `role="group"` labelled by `aria-label`, holding buttons with
 * `aria-pressed`. Colours via var(--bt-*); logical properties; both themes.
 */

import type { ReactNode } from "react";
import s from "./ModePicker.module.css";

export interface ModeOption<T extends string = string> {
  value: T;
  label: ReactNode;
}

export interface ModePickerProps<T extends string = string> {
  options: ModeOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
  "data-testid"?: string;
}

export function ModePicker<T extends string = string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
  "data-testid": dataTestId,
}: ModePickerProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  return (
    <div
      className={className ? `${s.picker} ${className}` : s.picker}
      role="group"
      aria-label={ariaLabel}
      data-testid={dataTestId}
      style={
        {
          "--count": options.length,
          "--active": activeIndex,
        } as React.CSSProperties
      }
    >
      {options.length > 0 && <span className={s.indicator} aria-hidden />}
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={s.segment}
            aria-pressed={active}
            data-active={active || undefined}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
