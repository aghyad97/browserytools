"use client";

/**
 * DeadPixelTest (R3 tool) — a fullscreen solid-colour cycler for spotting dead
 * (always-black) and stuck (always one colour) subpixels on a display.
 *
 * "Start test" fills a fixed, viewport-covering overlay with the first colour
 * and requests native fullscreen on it. Click or ArrowRight advances the cycle,
 * ArrowLeft steps back, Esc exits (native fullscreen exit). We also listen for
 * `fullscreenchange`: if the user leaves fullscreen by any means, the overlay
 * tears down and we return to the instructions. requestFullscreen can reject
 * (permissions) — we swallow it and still show the overlay full-viewport, so the
 * tool degrades gracefully. A hint caption fades out after ~3s.
 *
 * The five test hexes (+ the custom-colour input value) are CONTENT — they are
 * the tool's data, the exact fills under test — so they are applied as inline
 * styles per the R3 content-colour exception (same class as colour-picker swatch
 * data), not var(--bt-*) tokens. Every other surface uses tokens.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard } from "@/components/shared/SettingsCard";
import s from "./DeadPixelTest.module.css";

// CONTENT colours — the solid fills under test (R3 content-colour exception).
const TEST_COLORS = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"];

export default function DeadPixelTest() {
  const t = useTranslations("Tools.DeadPixelTest");
  const tc = useTranslations("ToolsConfig");

  const [testing, setTesting] = useState(false);
  const [index, setIndex] = useState(0);
  // CONTENT colour — the user's custom fill; joins the cycle as its last stop.
  const [customColor, setCustomColor] = useState("#808080");
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = [...TEST_COLORS, customColor];
  const total = colors.length;
  const currentColor = colors[index] ?? colors[0];

  const start = useCallback(() => {
    setIndex(0);
    setTesting(true);
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const back = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const exit = useCallback(() => {
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setTesting(false);
  }, []);

  // Runs only while testing: enters fullscreen, wires the key/exit listeners and
  // the fading hint. All of it is torn down the instant testing goes false.
  useEffect(() => {
    if (!testing) return;

    const el = containerRef.current;
    if (el?.requestFullscreen) {
      // Rejection (permissions) is fine — the overlay still fills the viewport.
      el.requestFullscreen().catch(() => {});
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        back();
      } else if (e.key === "Escape") {
        exit();
      }
    };
    // If the user leaves fullscreen by any means, drop back to the instructions.
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setTesting(false);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    setShowHint(true);
    const hintTimer = window.setTimeout(() => setShowHint(false), 3000);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.clearTimeout(hintTimer);
    };
  }, [testing, advance, back, exit]);

  return (
    <ToolShell
      slug="dead-pixel-test"
      title={tc("tools.dead-pixel-test.name")}
      sub={tc("tools.dead-pixel-test.description")}
      primaryAction={{ label: t("start"), onClick: start }}
    >
      <SettingsCard title={t("instructionsTitle")} data-testid="dead-pixel-instructions">
        <p className={s.instruction}>{t("instructionsDead")}</p>
        <p className={s.instruction}>{t("instructionsStuck")}</p>
        <p className={s.instruction}>{t("instructionsHowTo")}</p>

        <div className={s.swatches} data-testid="dead-pixel-swatches">
          {TEST_COLORS.map((c) => (
            // CONTENT colour — the swatch previews an exact fill under test.
            <span
              key={c}
              className={s.swatch}
              style={{ background: c }}
              data-color={c}
              title={c}
            />
          ))}
          <label className={s.customField}>
            <span className={s.customLabel}>{t("customColor")}</span>
            <input
              type="color"
              className={s.customInput}
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              data-testid="dead-pixel-custom"
            />
          </label>
        </div>
      </SettingsCard>

      {testing && (
        <div
          ref={containerRef}
          className={s.overlay}
          data-testid="dead-pixel-overlay"
          data-color={currentColor}
          // CONTENT colour — the fill currently under test.
          style={{ background: currentColor }}
          onClick={advance}
          role="button"
          tabIndex={0}
          aria-label={t("hintOverlay")}
        >
          {showHint && (
            <div className={s.hint} data-testid="dead-pixel-hint">
              {t("hintOverlay")}
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
