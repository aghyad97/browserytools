"use client";

/**
 * KeyboardTester (R3 §F2 wide tool) — a live visual ANSI-104 keyboard. Window
 * keydown/keyup listeners drive the board: a held key gets the pressed accent,
 * an ever-pressed key keeps the tested tint. StatStrip shows keys-tested/total,
 * current rollover (simultaneously held) and the max rollover seen, plus a
 * history line of the last codes and a reset.
 *
 * `event.code` is the identity (KeyA, Space, Numpad1…) so it is layout- and
 * locale-independent. The board itself is pinned `dir="ltr"` — it mirrors the
 * physical keyboard, not the reading direction — while the surrounding shell UI
 * stays logical. Colours via var(--bt-*); both themes.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { StatStrip } from "@/components/shared/StatStrip";
import { Card, CardContent } from "@/components/ui/card";
import s from "./KeyboardTester.module.css";

interface KeyDef {
  code: string;
  label: string;
  /** Flex-grow width in key units (1 = a standard 1u cap). Main-block only. */
  u?: number;
  /** Numpad grid placement (CSS grid line spec, e.g. "1 / 3"). */
  gridColumn?: string;
  gridRow?: string;
}

// ── Function row ──────────────────────────────────────────────────────────────
const FUNCTION_ROW: KeyDef[] = [
  { code: "Escape", label: "Esc" },
  { code: "F1", label: "F1" },
  { code: "F2", label: "F2" },
  { code: "F3", label: "F3" },
  { code: "F4", label: "F4" },
  { code: "F5", label: "F5" },
  { code: "F6", label: "F6" },
  { code: "F7", label: "F7" },
  { code: "F8", label: "F8" },
  { code: "F9", label: "F9" },
  { code: "F10", label: "F10" },
  { code: "F11", label: "F11" },
  { code: "F12", label: "F12" },
];

// ── Main block (number row → spacebar row) ────────────────────────────────────
const MAIN_ROWS: KeyDef[][] = [
  [
    { code: "Backquote", label: "`" },
    { code: "Digit1", label: "1" },
    { code: "Digit2", label: "2" },
    { code: "Digit3", label: "3" },
    { code: "Digit4", label: "4" },
    { code: "Digit5", label: "5" },
    { code: "Digit6", label: "6" },
    { code: "Digit7", label: "7" },
    { code: "Digit8", label: "8" },
    { code: "Digit9", label: "9" },
    { code: "Digit0", label: "0" },
    { code: "Minus", label: "-" },
    { code: "Equal", label: "=" },
    { code: "Backspace", label: "Backspace", u: 2 },
  ],
  [
    { code: "Tab", label: "Tab", u: 1.5 },
    { code: "KeyQ", label: "Q" },
    { code: "KeyW", label: "W" },
    { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" },
    { code: "KeyT", label: "T" },
    { code: "KeyY", label: "Y" },
    { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" },
    { code: "KeyO", label: "O" },
    { code: "KeyP", label: "P" },
    { code: "BracketLeft", label: "[" },
    { code: "BracketRight", label: "]" },
    { code: "Backslash", label: "\\", u: 1.5 },
  ],
  [
    { code: "CapsLock", label: "Caps", u: 1.75 },
    { code: "KeyA", label: "A" },
    { code: "KeyS", label: "S" },
    { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" },
    { code: "KeyG", label: "G" },
    { code: "KeyH", label: "H" },
    { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" },
    { code: "Semicolon", label: ";" },
    { code: "Quote", label: "'" },
    { code: "Enter", label: "Enter", u: 2.25 },
  ],
  [
    { code: "ShiftLeft", label: "Shift", u: 2.25 },
    { code: "KeyZ", label: "Z" },
    { code: "KeyX", label: "X" },
    { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" },
    { code: "KeyB", label: "B" },
    { code: "KeyN", label: "N" },
    { code: "KeyM", label: "M" },
    { code: "Comma", label: "," },
    { code: "Period", label: "." },
    { code: "Slash", label: "/" },
    { code: "ShiftRight", label: "Shift", u: 2.75 },
  ],
  [
    { code: "ControlLeft", label: "Ctrl", u: 1.25 },
    { code: "MetaLeft", label: "Meta", u: 1.25 },
    { code: "AltLeft", label: "Alt", u: 1.25 },
    { code: "Space", label: "Space", u: 6.25 },
    { code: "AltRight", label: "Alt", u: 1.25 },
    { code: "MetaRight", label: "Meta", u: 1.25 },
    { code: "ContextMenu", label: "Menu", u: 1.25 },
    { code: "ControlRight", label: "Ctrl", u: 1.25 },
  ],
];

// ── Navigation cluster ────────────────────────────────────────────────────────
const NAV_ROWS: KeyDef[][] = [
  [
    { code: "PrintScreen", label: "PrtSc" },
    { code: "ScrollLock", label: "ScrLk" },
    { code: "Pause", label: "Pause" },
  ],
  [
    { code: "Insert", label: "Ins" },
    { code: "Home", label: "Home" },
    { code: "PageUp", label: "PgUp" },
  ],
  [
    { code: "Delete", label: "Del" },
    { code: "End", label: "End" },
    { code: "PageDown", label: "PgDn" },
  ],
];
const ARROW_UP: KeyDef = { code: "ArrowUp", label: "↑" };
const ARROW_ROW: KeyDef[] = [
  { code: "ArrowLeft", label: "←" },
  { code: "ArrowDown", label: "↓" },
  { code: "ArrowRight", label: "→" },
];

// ── Numpad (explicit grid placement handles the tall +/Enter and wide 0) ──────
const NUMPAD: KeyDef[] = [
  { code: "NumLock", label: "Num", gridColumn: "1", gridRow: "1" },
  { code: "NumpadDivide", label: "/", gridColumn: "2", gridRow: "1" },
  { code: "NumpadMultiply", label: "*", gridColumn: "3", gridRow: "1" },
  { code: "NumpadSubtract", label: "-", gridColumn: "4", gridRow: "1" },
  { code: "Numpad7", label: "7", gridColumn: "1", gridRow: "2" },
  { code: "Numpad8", label: "8", gridColumn: "2", gridRow: "2" },
  { code: "Numpad9", label: "9", gridColumn: "3", gridRow: "2" },
  { code: "NumpadAdd", label: "+", gridColumn: "4", gridRow: "2 / 4" },
  { code: "Numpad4", label: "4", gridColumn: "1", gridRow: "3" },
  { code: "Numpad5", label: "5", gridColumn: "2", gridRow: "3" },
  { code: "Numpad6", label: "6", gridColumn: "3", gridRow: "3" },
  { code: "Numpad1", label: "1", gridColumn: "1", gridRow: "4" },
  { code: "Numpad2", label: "2", gridColumn: "2", gridRow: "4" },
  { code: "Numpad3", label: "3", gridColumn: "3", gridRow: "4" },
  { code: "NumpadEnter", label: "Enter", gridColumn: "4", gridRow: "4 / 6" },
  { code: "Numpad0", label: "0", gridColumn: "1 / 3", gridRow: "5" },
  { code: "NumpadDecimal", label: ".", gridColumn: "3", gridRow: "5" },
];

/** Every code that appears somewhere on the board — used to size the layout. */
const LAYOUT_CODES = new Set<string>(
  [
    ...FUNCTION_ROW,
    ...MAIN_ROWS.flat(),
    ...NAV_ROWS.flat(),
    ARROW_UP,
    ...ARROW_ROW,
    ...NUMPAD,
  ].map((k) => k.code)
);
const TOTAL_KEYS = LAYOUT_CODES.size;

const HISTORY_LEN = 15;

/** Keys we swallow on keydown so the browser doesn't scroll/focus-trap while
 *  the tester has focus. Exactly the brief's set: Space, Tab, Alt*, F1–F12. */
function shouldPreventDefault(code: string): boolean {
  return (
    code === "Space" ||
    code === "Tab" ||
    code === "AltLeft" ||
    code === "AltRight" ||
    /^F([1-9]|1[0-2])$/.test(code)
  );
}

export default function KeyboardTester() {
  const t = useTranslations("Tools.KeyboardTester");
  const tc = useTranslations("ToolsConfig");

  const [pressed, setPressed] = useState<Set<string>>(() => new Set());
  const [tested, setTested] = useState<Set<string>>(() => new Set());
  const [history, setHistory] = useState<string[]>([]);
  const [maxRollover, setMaxRollover] = useState(0);

  const reset = useCallback(() => {
    setPressed(new Set());
    setTested(new Set());
    setHistory([]);
    setMaxRollover(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldPreventDefault(e.code)) e.preventDefault();
      // Auto-repeat fires keydown continuously while a key is held; only record
      // the initial press so history and rollover stay meaningful.
      if (e.repeat) return;

      setPressed((prev) => {
        if (prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.add(e.code);
        setMaxRollover((m) => Math.max(m, next.size));
        return next;
      });
      setTested((prev) => {
        if (prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
      setHistory((prev) => [e.code, ...prev].slice(0, HISTORY_LEN));
    };

    const onKeyUp = (e: KeyboardEvent) => {
      setPressed((prev) => {
        if (!prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    // On some platforms (e.g. a held Meta on macOS) keyup can be swallowed and
    // caps would stay stuck; clearing held state on blur avoids that leak.
    const onBlur = () => setPressed(new Set());

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  const testedCount = tested.size;
  const rollover = pressed.size;

  const renderKey = useCallback(
    (key: KeyDef) => {
      const isPressed = pressed.has(key.code);
      const isTested = tested.has(key.code);
      return (
        <div
          key={key.code}
          className={s.key}
          data-testid="keyboard-key"
          data-code={key.code}
          data-pressed={isPressed ? "true" : undefined}
          data-tested={isTested ? "true" : undefined}
          style={
            {
              "--u": key.u ?? 1,
              gridColumn: key.gridColumn,
              gridRow: key.gridRow,
            } as React.CSSProperties
          }
          title={key.code}
        >
          <span className={s.keyLabel}>{key.label}</span>
        </div>
      );
    },
    [pressed, tested]
  );

  const historyLine = useMemo(
    () => (history.length ? history.join(" · ") : "—"),
    [history]
  );

  return (
    <ToolShell
      slug="keyboard-tester"
      title={tc("tools.keyboard-tester.name")}
      sub={tc("tools.keyboard-tester.description")}
      primaryAction={{ label: t("reset"), onClick: reset }}
      width="wide"
    >
      <Card className="shadow-none">
        <CardContent className="space-y-6 pt-6">
          <p className="text-sm text-muted-foreground">{t("pressAnyKey")}</p>

          <StatStrip
            data-testid="keyboard-stats"
            items={[
              {
                label: t("keysTested"),
                value: (
                  <span data-testid="stat-tested" dir="ltr">
                    {testedCount}/{TOTAL_KEYS}
                  </span>
                ),
              },
              {
                label: t("rollover"),
                value: <span data-testid="stat-rollover">{rollover}</span>,
              },
              {
                label: t("maxRollover"),
                value: <span data-testid="stat-max">{maxRollover}</span>,
              },
            ]}
          />

          {/* The board mirrors the physical keyboard, so it is pinned LTR even
              in RTL locales; the rest of the UI stays logical. */}
          <div className={s.board} data-testid="keyboard-board" dir="ltr">
            <div className={s.functionRow}>{FUNCTION_ROW.map(renderKey)}</div>

            <div className={s.lower}>
              <div className={s.mainBlock}>
                {MAIN_ROWS.map((row, i) => (
                  <div className={s.row} key={i}>
                    {row.map(renderKey)}
                  </div>
                ))}
              </div>

              <div className={s.navCluster}>
                {NAV_ROWS.map((row, i) => (
                  <div className={s.navRow} key={i}>
                    {row.map(renderKey)}
                  </div>
                ))}
                <div className={s.navRow}>{renderKey(ARROW_UP)}</div>
                <div className={s.navRow}>{ARROW_ROW.map(renderKey)}</div>
              </div>

              <div className={s.numpad}>{NUMPAD.map(renderKey)}</div>
            </div>
          </div>

          <div className={s.historyWrap}>
            <span className={s.historyLabel}>{t("history")}</span>
            <span className={s.history} data-testid="keyboard-history" dir="ltr">
              {historyLine}
            </span>
          </div>
        </CardContent>
      </Card>
    </ToolShell>
  );
}
