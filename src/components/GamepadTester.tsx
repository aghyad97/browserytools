"use client";

/**
 * GamepadTester (R3 wide tool) — a live view of every connected controller. The
 * Gamepad API has no per-frame event stream, so a requestAnimationFrame loop
 * polls `navigator.getGamepads()` each frame; the loop starts on
 * `gamepadconnected` (or on mount if a pad is already present — reconnection
 * after a refresh often doesn't re-fire the event until the first input) and
 * stops once no pads remain. Gamepad snapshots are frozen per frame, so we
 * re-call getGamepads() inside the loop rather than holding a reference.
 *
 * Per pad: id + mapping, a grid of indexed button tiles (pressed → accent fill,
 * analog `value` as a fill bar), and axes paired into stick visualizers (a dot
 * in a circle) with raw 4-decimal readouts for drift checking. If the pad
 * exposes a vibration actuator, a "Test vibration" button plays a dual-rumble.
 *
 * The stick dots and numeric axis/button readouts are physical/numeric, so they
 * are pinned dir="ltr" even in RTL locales; the surrounding shell stays logical.
 * Colours via var(--bt-*) tokens (light+dark); logical properties throughout.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import s from "./GamepadTester.module.css";

interface ButtonState {
  pressed: boolean;
  value: number;
}

interface PadState {
  index: number;
  id: string;
  mapping: string;
  buttons: ButtonState[];
  axes: number[];
  hasVibration: boolean;
}

/** Cheap per-frame signature — we only re-render when it changes so an idle
 *  controller doesn't burn CPU re-rendering identical state at 60fps. Button
 *  values and axes are quantised so sub-pixel analog jitter alone doesn't force
 *  a render, while any meaningful movement still does. */
function signature(pads: (Gamepad | null)[]): string {
  let sig = "";
  for (const pad of pads) {
    if (!pad) continue;
    sig += `${pad.index}:${pad.id}|`;
    for (const b of pad.buttons) sig += `${b.pressed ? 1 : 0}${Math.round(b.value * 100)},`;
    for (const a of pad.axes) sig += `${Math.round(a * 1000)};`;
    sig += "#";
  }
  return sig;
}

function toPadState(pad: Gamepad): PadState {
  return {
    index: pad.index,
    id: pad.id,
    mapping: pad.mapping || "",
    buttons: pad.buttons.map((b) => ({ pressed: b.pressed, value: b.value })),
    axes: Array.from(pad.axes),
    hasVibration: typeof pad.vibrationActuator?.playEffect === "function",
  };
}

/** Pair a flat axes array into [x, y] stick pairs. A trailing odd axis (rare)
 *  becomes a single-value "stick" with y pinned to 0. */
function toSticks(axes: number[]): { x: number; y: number }[] {
  const sticks: { x: number; y: number }[] = [];
  for (let i = 0; i < axes.length; i += 2) {
    sticks.push({ x: axes[i] ?? 0, y: axes[i + 1] ?? 0 });
  }
  return sticks;
}

export default function GamepadTester() {
  const t = useTranslations("Tools.GamepadTester");
  const tc = useTranslations("ToolsConfig");

  const [pads, setPads] = useState<PadState[]>([]);
  const rafRef = useRef<number | null>(null);
  const sigRef = useRef<string>("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const readPads = (): (Gamepad | null)[] => {
      const raw = navigator.getGamepads?.() ?? [];
      return Array.from(raw);
    };

    const loop = () => {
      if (!mountedRef.current) return;
      const raw = readPads();
      const live = raw.filter((p): p is Gamepad => p != null);
      const sig = signature(raw);
      if (sig !== sigRef.current) {
        sigRef.current = sig;
        setPads(live.map(toPadState));
      }
      if (live.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // No pads left — halt the loop; a future connect restarts it.
        rafRef.current = null;
      }
    };

    const start = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop);
    };

    const onConnect = () => start();
    // On disconnect keep polling one more frame so the loop observes the now-empty
    // set and clears the UI (and then halts itself). If already running this is a
    // no-op.
    const onDisconnect = () => start();

    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onDisconnect);

    // Reconnection after a refresh frequently doesn't re-fire gamepadconnected
    // until the first input, so seed the loop if a pad is already present.
    if (readPads().some((p) => p != null)) start();

    return () => {
      mountedRef.current = false;
      window.removeEventListener("gamepadconnected", onConnect);
      window.removeEventListener("gamepaddisconnected", onDisconnect);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const vibrate = useCallback((index: number) => {
    // Snapshots are frozen per frame, so re-fetch the live pad before actuating.
    const pad = navigator.getGamepads?.()[index];
    pad?.vibrationActuator?.playEffect("dual-rumble", {
      duration: 500,
      strongMagnitude: 0.8,
      weakMagnitude: 0.4,
    });
  }, []);

  return (
    <ToolShell
      slug="gamepad-tester"
      title={tc("tools.gamepad-tester.name")}
      sub={tc("tools.gamepad-tester.description")}
      width="wide"
    >
      {pads.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="pt-6">
            <div className={s.empty} data-testid="gamepad-empty">
              <span className={s.emptyIcon} aria-hidden="true">
                🎮
              </span>
              <p className={s.emptyText}>{t("connectPrompt")}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={s.pads} data-testid="gamepad-pads">
          {pads.map((pad) => (
            <Card key={pad.index} className="shadow-none" data-testid="gamepad-pad">
              <CardContent className="space-y-6 pt-6">
                <div className={s.header}>
                  <div className={s.headerMeta}>
                    <span className={s.padId}>{pad.id}</span>
                    <span className={s.padSub}>
                      {t("connected")}
                      {pad.mapping ? ` · ${t("mapping")}: ` : ""}
                      {pad.mapping ? <span dir="ltr">{pad.mapping}</span> : null}
                      {` · #`}
                      <span dir="ltr">{pad.index}</span>
                    </span>
                  </div>
                  {pad.hasVibration && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => vibrate(pad.index)}
                      data-testid="gamepad-vibrate"
                    >
                      {t("vibrationTest")}
                    </Button>
                  )}
                </div>

                <section>
                  <div className={s.sectionLabel}>{t("buttons")}</div>
                  <div className={s.buttonGrid} dir="ltr">
                    {pad.buttons.map((b, i) => (
                      <div
                        key={i}
                        className={s.button}
                        data-testid="gamepad-button"
                        data-index={i}
                        data-pressed={b.pressed ? "true" : undefined}
                        title={`#${i}`}
                      >
                        <span className={s.buttonIndex}>{i}</span>
                        <span
                          className={s.buttonFill}
                          style={{ blockSize: `${Math.round(b.value * 100)}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className={s.sectionLabel}>{t("axes")}</div>
                  <div className={s.sticks} dir="ltr">
                    {toSticks(pad.axes).map((stick, i) => (
                      <div key={i} className={s.stick} data-testid="gamepad-stick">
                        <div className={s.stickPad}>
                          <span
                            className={s.stickDot}
                            style={{
                              insetInlineStart: `${((stick.x + 1) / 2) * 100}%`,
                              insetBlockStart: `${((stick.y + 1) / 2) * 100}%`,
                            }}
                          />
                        </div>
                        <div className={s.stickValues}>
                          <span data-testid="gamepad-axis">{stick.x.toFixed(4)}</span>
                          <span data-testid="gamepad-axis">{stick.y.toFixed(4)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
