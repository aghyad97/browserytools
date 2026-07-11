"use client";

/**
 * Shared settings/options card (R3 §F3 M3) — replaces the 71 `Card > CardHeader
 * > CardContent space-y-{4,6}` patterns and, crucially, sets THE one padding
 * rule for tool interiors: 20px inline / 16px block (killing the p-4-vs-p-6 and
 * space-y-4-vs-6 drift documented in recon §1).
 *
 * `OptionRow` is the label+control row that lives inside it: a consistent mono
 * uppercase label (wired to the control via htmlFor), an optional hint, and the
 * control as children.
 *
 * Colours via var(--bt-*); logical properties; both themes; no single-edge
 * borders.
 */

import type { ReactNode } from "react";
import s from "./SettingsCard.module.css";

export interface SettingsCardProps {
  /** Optional card title (mono uppercase caption). */
  title?: ReactNode;
  /** Optional descriptive line under the title. */
  description?: ReactNode;
  children?: ReactNode;
  /** Extra class(es) merged onto the root after the card's own class. */
  className?: string;
  "data-testid"?: string;
}

export function SettingsCard({
  title,
  description,
  children,
  className,
  "data-testid": dataTestId,
}: SettingsCardProps) {
  return (
    <div className={className ? `${s.card} ${className}` : s.card} data-testid={dataTestId}>
      {(title != null || description != null) && (
        <div className={s.head}>
          {title != null && <div className={s.title}>{title}</div>}
          {description != null && <p className={s.description}>{description}</p>}
        </div>
      )}
      <div className={s.rows}>{children}</div>
    </div>
  );
}

export interface OptionRowProps {
  /** Row label — rendered as a <label> when htmlFor is set, else a <span>. */
  label: ReactNode;
  /** Optional secondary hint under the label. */
  hint?: ReactNode;
  /** id of the control this label describes (wires the <label for>). */
  htmlFor?: string;
  /** The control(s). */
  children?: ReactNode;
  className?: string;
}

export function OptionRow({ label, hint, htmlFor, children, className }: OptionRowProps) {
  return (
    <div className={className ? `${s.row} ${className}` : s.row}>
      <div className={s.rowHead}>
        {htmlFor ? (
          <label className={s.label} htmlFor={htmlFor}>
            {label}
          </label>
        ) : (
          <span className={s.label}>{label}</span>
        )}
        {hint != null && <span className={s.hint}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
