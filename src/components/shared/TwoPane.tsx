"use client";

/**
 * Shared responsive input/output split (R3 §F3 M2) — the ~40 editor/converter
 * tools that laid out `grid grid-cols-1 lg:grid-cols-2` panes by hand. Splits
 * `start` | `end` side by side, stacking to one column under ~720px. The
 * breakpoint is a CONTAINER query on the pane's own width (not the viewport),
 * so it stacks correctly inside the narrow default shell AND stays split inside
 * a wide one.
 *
 * `ratio` sets the start:end column proportion (default 1 = equal halves).
 * Colours/spacing via var(--bt-*) rhythm; logical properties; both themes.
 */

import type { ReactNode } from "react";
import s from "./TwoPane.module.css";

export interface TwoPaneProps {
  start: ReactNode;
  end: ReactNode;
  /** start:end column proportion when split (default 1 = equal). */
  ratio?: number;
  className?: string;
  "data-testid"?: string;
}

export function TwoPane({ start, end, ratio = 1, className, "data-testid": dataTestId }: TwoPaneProps) {
  return (
    <div
      className={className ? `${s.pane} ${className}` : s.pane}
      data-testid={dataTestId}
      style={{ "--cols": `${ratio}fr 1fr` } as React.CSSProperties}
    >
      <div className={s.cell}>{start}</div>
      <div className={s.cell}>{end}</div>
    </div>
  );
}
