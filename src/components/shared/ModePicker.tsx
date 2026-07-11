"use client";

/**
 * Shared segmented mode picker (R3 §F3 M6) — one idiom for the 38 places that
 * used `Tabs`/`TabsList` (or a hand-rolled button group) purely as a mode
 * switch (output format, result tab). A sliding active indicator gives it the
 * segmented look; the slide is pure CSS (transform + inline-size driven by
 * `--x`/`--w`) and is gated behind prefers-reduced-motion. NOT framer.
 *
 * Track is a flex row, not a grid: segments size to their content
 * (`flex: 1 0 max-content`), so unequal-length labels (e.g. Arabic
 * "درجة الحرارة" among 6 unit-converter categories) never jam to
 * min-content. When the segments' natural width exceeds the container, the
 * root scrolls horizontally instead of overflowing the layout.
 *
 * The indicator is positioned by *measuring* the active segment's
 * `offsetLeft`/`offsetWidth` (via ResizeObserver + font-load + active-change)
 * rather than computing from `--count`/`--active` index math — the old
 * equal-width assumption broke as soon as segments could differ in width.
 * `offsetLeft` is a physical (left-edge) measurement regardless of `dir`, so
 * this also fixes RTL for free — no mirrored transform needed.
 *
 * Semantics: a `role="group"` labelled by `aria-label`, holding buttons with
 * `aria-pressed`. Colours via var(--bt-*); logical properties; both themes.
 */

import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
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

  const rootRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Array<HTMLButtonElement | null>>([]);
  segmentRefs.current.length = options.length;

  const measure = useCallback(() => {
    const root = rootRef.current;
    const segment = segmentRefs.current[activeIndex];
    if (!root || !segment) return;
    root.style.setProperty("--x", `${segment.offsetLeft}px`);
    root.style.setProperty("--w", `${segment.offsetWidth}px`);
  }, [activeIndex]);

  // Re-measure whenever the active segment changes (and once on mount).
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Re-measure on container resize (viewport resize, container queries,
  // sidebar collapse, etc.) — segment widths are layout-dependent.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  // Web fonts can finish loading after first paint and change label widths.
  useEffect(() => {
    const fonts = typeof document !== "undefined" ? document.fonts : undefined;
    if (!fonts?.ready) return;
    let cancelled = false;
    fonts.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
  }, [measure]);

  // Keep the active segment in view when the track scrolls horizontally.
  useEffect(() => {
    segmentRefs.current[activeIndex]?.scrollIntoView({
      inline: "nearest",
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <div
      ref={rootRef}
      className={className ? `${s.picker} ${className}` : s.picker}
      role="group"
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {options.length > 0 && <span className={s.indicator} aria-hidden />}
      {options.map((opt, index) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              segmentRefs.current[index] = el;
            }}
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
