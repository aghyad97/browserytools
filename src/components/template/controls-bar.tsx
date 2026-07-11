"use client";

/**
 * Zone 4 of the five-zone tool template: a single bordered card holding a
 * tool's live controls. Mono labels + inputs sit at the start; live stats go at
 * the end (use `<ControlStat>` for tabular-num alignment); the one dark-pill
 * primary action is always last and end-aligned (spec §3). Never a single-edge
 * accent bar.
 *
 * Rendered by <ToolShell>, but exported standalone so a tool can compose its own
 * controls region when it needs more than the shell's default wiring.
 */

import type { PrimaryAction } from "./tool-shell";
import s from "./tool-shell.module.css";

/**
 * End-aligned live stat for the controls bar: an optional mono uppercase
 * caption over a tabular-num value. Exported so tools never have to import
 * tool-shell.module.css for the `controlStat`/`controlLabel` classes.
 */
export function ControlStat({
  label,
  children,
}: {
  /** Mono uppercase caption rendered above the value. */
  label?: React.ReactNode;
  /** The live value (tabular-nums, end-aligned). */
  children: React.ReactNode;
}) {
  return (
    <span className={s.controlStat} data-testid="tool-shell-control-stat">
      {label != null && <span className={s.controlLabel}>{label}</span>}
      {children}
    </span>
  );
}

export function ControlsBar({
  children,
  primaryAction,
}: {
  children?: React.ReactNode;
  primaryAction?: PrimaryAction;
}) {
  return (
    <div className={s.controls} data-testid="tool-shell-controls">
      {children}
      {primaryAction && (
        <button
          type="button"
          className={s.pillPrimary}
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          data-testid="tool-shell-primary"
        >
          {primaryAction.label}
        </button>
      )}
    </div>
  );
}
