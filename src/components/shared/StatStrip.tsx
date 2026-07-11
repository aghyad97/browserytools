"use client";

/**
 * Shared in-stage stat strip (R3 §F3 M5) — the interior counterpart to the
 * controls-bar `ControlStat`. Recon found 18+ tools rolling their own
 * big-number + caption stat rows (TextCounter, WordFrequency, PasswordStrength,
 * ImageCompression…). This is the shared version for the stage body; it does
 * NOT touch `ControlStat`, which stays the controls-bar primitive.
 *
 * Same visual DNA as ControlStat — mono uppercase caption, tabular-num value —
 * scaled up for a prominent in-stage readout. Colours via var(--bt-*); logical
 * properties; both themes.
 */

import type { ReactNode } from "react";
import s from "./StatStrip.module.css";

export interface StatItem {
  label: ReactNode;
  value: ReactNode;
  /** Optional secondary caption under the label — muted, 12px, normal-case. */
  sub?: ReactNode;
}

export interface StatStripProps {
  items: StatItem[];
  className?: string;
  "data-testid"?: string;
}

export function StatStrip({ items, className, "data-testid": dataTestId }: StatStripProps) {
  return (
    <div className={className ? `${s.strip} ${className}` : s.strip} data-testid={dataTestId}>
      {items.map((item, i) => (
        <div className={s.stat} key={i}>
          <span className={s.value}>{item.value}</span>
          <span className={s.label}>{item.label}</span>
          {item.sub != null && <span className={s.sub}>{item.sub}</span>}
        </div>
      ))}
    </div>
  );
}
