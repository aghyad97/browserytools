"use client";

/**
 * The support receipt — the product's one earned ask.
 *
 * Design brief: stop asking for support, print proof of what just happened and
 * let the proof carry the ask. Every tool saves through `src/lib/download.ts`,
 * which publishes a ToolResult; this component listens and prints the facts the
 * browser actually measured, plus a quiet two-link ask.
 *
 * The not-annoying contract, enforced mechanically here:
 *   - never a modal, never an overlay, never blocks the download
 *   - only ever appears after a tool actually delivered something
 *   - always auto-hides, and the timer pauses while the pointer or keyboard
 *     focus is inside it, so it cannot vanish mid-reach
 *   - dismissing is permanent and one-way (support-store), and is the only
 *     gate on the ask
 *
 * Placement: on wide viewports it lands in the dead column beside the
 * start-aligned 880px tool shell (tool-shell.module.css:14). Below that
 * threshold it sits inline under the tool. Logical properties throughout, so
 * under dir="rtl" the gutter mirrors to the other side for free.
 *
 * Honesty rules: `0 bytes uploaded` renders only for tools whose tools-config
 * entry is on-device, and byte counts render only when actually measured.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CoffeeIcon, StarIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { onToolResult, type ToolResult } from "@/lib/tool-result";
import { useSupportStore } from "@/store/support-store";
import { useGithubStars, formatStars, GITHUB_URL } from "@/lib/use-github-stars";
import { splitLocalePath } from "@/lib/locales";
import { formatBytes } from "@/lib/format";
import { tools } from "@/lib/tools-config";
import s from "./tool-receipt.module.css";

/** slug -> on-device flag, built once from the shared config. */
const SLUG_ON_DEVICE = new Map<string, boolean>();
for (const category of tools) {
  for (const tool of category.items) {
    SLUG_ON_DEVICE.set(tool.href.split("/").pop() as string, tool.onDevice !== false);
  }
}

/** How long a receipt with no ask stays up. */
const AUTO_HIDE_MS = 6000;
/** Longer when the links are showing, so there is time to actually reach them. */
const AUTO_HIDE_ASKING_MS = 9000;

export function ToolReceipt() {
  const t = useTranslations("Receipt");
  const pathname = usePathname();
  const stars = useGithubStars();
  const { dismissed, recordWin, dismiss } = useSupportStore();

  const [result, setResult] = useState<ToolResult | null>(null);
  const [asking, setAsking] = useState(false);
  const [wide, setWide] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Latest dismissal state, read inside the subscription without making the
  // effect re-subscribe on every result.
  const gov = useRef({ dismissed });
  gov.current = { dismissed };

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearTimer();
    setResult(null);
    setAsking(false);
  }, [clearTimer]);

  /* Re-arms the auto-hide after the pointer or focus leaves. */
  const restartTimer = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(
      () => setResult(null),
      asking ? AUTO_HIDE_ASKING_MS : AUTO_HIDE_MS,
    );
  }, [clearTimer, asking]);

  useEffect(() => {
    return onToolResult((next) => {
      recordWin();

      // The links ride along on every receipt. They cost the visitor nothing,
      // the receipt only ever appears after the tool actually delivered
      // something, and it never blocks anything — so the only gate left is the
      // permanent opt-out. Earlier this also required N successful downloads
      // and capped itself at one ask per session; both made the ask essentially
      // unobservable, including to the person who owns the product.
      const eligible = !gov.current.dismissed;

      // The wide shell (1180px) leaves no gutter until a much larger viewport,
      // so the CSS needs to know which shell is on screen. Read it at event
      // time from the attribute tool-shell.tsx already stamps.
      setWide(!!document.querySelector('[data-width="wide"]'));
      setResult(next);
      setAsking(eligible);

      clearTimer();
      // Always auto-hides now — with the ask on every receipt, a card that
      // waited for a click would just become permanent furniture.
      timer.current = setTimeout(
        () => setResult(null),
        eligible ? AUTO_HIDE_ASKING_MS : AUTO_HIDE_MS,
      );
    });
  }, [recordWin, clearTimer]);

  // Never let a receipt trail the visitor onto the next tool.
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => clearTimer, [clearTimer]);

  /* One coffee CTA per screen (the invariant stated in rail.tsx). While the
     earned ask is up it owns the coffee slot, so the ambient top-bar pill
     stands down — see the [data-support-asking] rule in top-bar.module.css.
     Signalled on <html> because the top bar is an unrelated sibling with no
     prop path to this component. */
  useEffect(() => {
    const root = document.documentElement;
    if (asking) root.dataset.supportAsking = "true";
    else delete root.dataset.supportAsking;
    return () => {
      delete root.dataset.supportAsking;
    };
  }, [asking]);

  if (!result) return null;

  const slug = splitLocalePath(pathname || "/").path.split("/").pop() ?? "";
  const onDevice = SLUG_ON_DEVICE.get(slug) ?? true;

  return (
    <div
      className={s.receipt}
      data-wide={wide ? "true" : "false"}
      data-asking={asking ? "true" : "false"}
      data-testid="tool-receipt"
      role="status"
      aria-live="polite"
      /* Hold it open while the visitor is actually engaging with it. Without
         this, a receipt carrying clickable links can disappear out from under
         a moving cursor. */
      onMouseEnter={clearTimer}
      onFocusCapture={clearTimer}
      onMouseLeave={restartTimer}
      onBlurCapture={restartTimer}
    >
      <div className={s.facts}>
        <span className={s.saved}>{t("saved")}</span>
        <span className={s.file} title={result.filename}>
          {result.filename}
        </span>
        {typeof result.outputBytes === "number" && (
          <span className={s.metric}>{formatBytes(result.outputBytes)}</span>
        )}
        {typeof result.ms === "number" && (
          <span className={s.metric}>{(result.ms / 1000).toFixed(1)}s</span>
        )}
        {onDevice && <span className={s.zero}>{t("noUpload")}</span>}
      </div>

      {asking && (
        <div className={s.ask}>
          <p className={s.pitch}>{onDevice ? t("pitch") : t("pitchNetwork")}</p>
          <div className={s.links}>
            <a
              className={s.link}
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StarIcon size={12} strokeWidth={2} className={s.starIcon} />
              {t("star")}
              {stars !== null && (
                <span className={s.count}>{formatStars(stars)}</span>
              )}
            </a>
            {/* Plain <a>: /coffee is a server route that redirects off-site to
                Stripe, which the client router cannot follow. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className={s.link} href="/coffee">
              <CoffeeIcon size={12} className={s.coffeeIcon} />
              {t("coffee")}
            </a>
          </div>
          <button
            type="button"
            className={s.dismiss}
            onClick={() => {
              dismiss();
              close();
            }}
            aria-label={t("dismiss")}
            title={t("dismiss")}
          >
            <XIcon size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
