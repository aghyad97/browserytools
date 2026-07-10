"use client";

/**
 * Production ⌘K command palette — search-and-go over the full tool catalog.
 *
 * Ported from the /preview prototype (src/app/preview/ui.tsx CommandPalette /
 * useCommandPalette) with the production upgrades required by the R2 spec:
 *   1. Logical properties only (RTL mirrors for free via dir="rtl").
 *   2. Every user-visible string through next-intl — tool names via
 *      ToolsConfig.tools.<slug>.name, category tags via
 *      ToolsConfig.categoriesShort.<id>, placeholder via
 *      Landing.searchPlaceholder, empty state via Sidebar.noToolsFound.
 *   3. All colours via var(--bt-*) design tokens (light + dark).
 *
 * Keyboard contract: ⌘K / Ctrl+K toggles, "/" opens when not typing in a
 * field, Escape closes, ArrowUp/ArrowDown move the selection, Enter opens
 * the selected tool. Keyboard-initiated → zero open/close animation.
 *
 * This component is NOT mounted into the production layout here — the
 * chrome-switchover task wires it (and the Rail, its sibling) in. Together
 * with the landing search button it SUPERSEDES the homepage search input and
 * sidebar search; the `?search=` server redirect in src/app/(home)/page.tsx
 * stays untouched (SEO contract).
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-config";
import s from "./command-palette.module.css";

/* Locale-independent flat index — names/labels resolve via i18n at render. */
const TOOL_INDEX = tools.flatMap((c) =>
  c.items.map((t) => ({
    slug: t.href.split("/").pop() as string,
    href: t.href,
    icon: t.icon,
    categoryId: c.id,
  })),
);

const TOOL_COUNT = TOOL_INDEX.length;
const MAX_RESULTS = 9;

/* Open/close state + global shortcuts: ⌘K / Ctrl+K toggle, "/" when idle,
   Escape closes. Ported unchanged from the prototype. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !isTyping(e))
      ) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);
  return { open, setOpen };
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  return (
    t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable
  );
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Landing");
  const tRail = useTranslations("Rail");
  const tc = useTranslations("ToolsConfig");
  const tSidebar = useTranslations("Sidebar");
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);

  /* Translated + locale-sorted catalog. Rebuilt when the locale's t changes. */
  const catalog = useMemo(
    () =>
      TOOL_INDEX.map((tool) => ({
        ...tool,
        name: tc(`tools.${tool.slug}.name` as never) as string,
        category: tc(`categoriesShort.${tool.categoryId}` as never) as string,
      })).sort((a, b) => a.name.localeCompare(b.name)),
    [tc],
  );

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return catalog.slice(0, MAX_RESULTS);
    return catalog
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query) ||
          tool.slug.includes(query),
      )
      .slice(0, MAX_RESULTS);
  }, [q, catalog]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIndex(0);
    }
  }, [open]);

  useEffect(() => setIndex(0), [q]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  if (!open) return null;

  return (
    <div
      className={s.overlay}
      data-testid="command-palette-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-label={tRail("search")}
        data-testid="command-palette"
      >
        <input
          autoFocus
          className={s.input}
          role="combobox"
          aria-expanded="true"
          aria-controls="command-palette-results"
          aria-autocomplete="list"
          aria-activedescendant={
            results[index] ? `palette-item-${results[index].slug}` : undefined
          }
          placeholder={t("searchPlaceholder", { count: TOOL_COUNT })}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && results[index]) {
              go(results[index].href);
            }
          }}
        />
        <div className={s.divider} aria-hidden />
        <div className={s.list} id="command-palette-results" role="listbox">
          {results.length === 0 && (
            <div className={s.empty}>{tSidebar("noToolsFound")}</div>
          )}
          {results.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.href}
                id={`palette-item-${tool.slug}`}
                role="option"
                aria-selected={i === index}
                data-testid="palette-item"
                data-href={tool.href}
                className={i === index ? s.itemActive : s.item}
                onMouseEnter={() => setIndex(i)}
                onClick={() => go(tool.href)}
              >
                <Icon size={15} strokeWidth={1.8} />
                {tool.name}
                <span className={s.itemCat}>{tool.category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
