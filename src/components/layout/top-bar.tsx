"use client";

/**
 * Sticky glass top bar — desktop-only (>900px) chrome rendered at the top of
 * the content column on every AppShell route. It carries exactly one thing:
 * a wide ⌘K search trigger (start side) that opens the shared command palette
 * via the global openCommandPalette event (no prop-drilling). The coffee CTA
 * and the theme/language/sound switchers live in the rail bottom (see
 * rail.tsx), not here.
 *
 * Sticky (not fixed) so it takes layout space and never overlaps or
 * double-pads content. Under 900px it's hidden — the fixed mobile bar owns
 * chrome there. Strings via existing i18n keys only, colours via var(--bt-*),
 * logical properties so the field hugs the start edge under dir="rtl" too.
 */

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-config";
import { openCommandPalette } from "./command-palette";
import s from "./top-bar.module.css";

const TOOL_COUNT = tools.reduce((n, c) => n + c.items.length, 0);

export function TopBar() {
  const t = useTranslations("Landing");
  const placeholder = t("searchPlaceholder", { count: TOOL_COUNT });

  return (
    <div className={s.bar}>
      <button
        type="button"
        className={s.search}
        onClick={openCommandPalette}
        aria-label={placeholder}
      >
        <SearchIcon size={14} aria-hidden />
        <span className={s.searchText}>{placeholder}</span>
        <span className={s.kbd}>⌘K</span>
      </button>
    </div>
  );
}
