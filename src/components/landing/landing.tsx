"use client";

/**
 * Production landing — the rail-shell home page.
 *
 * Ported from the /preview prototype (src/app/preview/page.tsx + ui.tsx) with
 * the four production deltas required by the task-8 brief / spec §6:
 *   1. Full-catalog crawlable surface — an "All tools" section renders EVERY
 *      tool as a link grouped by category (not the prototype's 47-tile subset),
 *      so search engines see the whole catalog from the landing (spec §6.5).
 *   2. Featured "Apps" strip lists LIVE routes only (src/lib/featured-apps.ts).
 *   3. Favorites / Recently-used rows from the persisted stores, shown only
 *      when non-empty (client-only to avoid a hydration mismatch).
 *   4. StructuredData (in page.tsx), HomeFAQ and the footer (in the layout) are
 *      preserved.
 *
 * Binding: all colours via var(--bt-*) tokens (light+dark), logical properties
 * throughout (RTL mirrors for free), existing i18n keys only, one coffee CTA.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CoffeeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { tools, getAllTools } from "@/lib/tools-config";
import { FEATURED_APPS, type FeaturedApp } from "@/lib/featured-apps";
import { openCommandPalette } from "@/components/layout/command-palette";
import { useFavoritesStore } from "@/store/favorites-store";
import { useRecentToolsStore } from "@/store/recent-tools-store";
import HomeFAQ from "@/components/HomeFAQ";
import { ToolTile } from "@/components/shared/ToolTile";
import { CHIP } from "@/lib/category-chips";
import s from "./landing.module.css";

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
const POPULAR_LIMIT = 47;

/* Category list (id + count), ordered — labels come from i18n at render. */
const CATEGORIES = tools
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((c) => ({ id: c.id, count: c.items.length }));

/* Full catalog grouped by category for the crawlable "All tools" surface.
   Copy before sorting — never mutate the shared config (an in-place sort
   desyncs SSR vs client order and breaks hydration). */
const GROUPED = tools
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((c) => ({
    id: c.id,
    items: [...c.items]
      .sort((a, b) => a.order - b.order)
      .map((t) => ({
        slug: t.href.split("/").pop() as string,
        href: t.href,
        icon: t.icon,
      })),
  }));

/* ---------- tool tile (shared by Popular / favorites / recent / catalog) ---------- */

function Tile({
  href,
  slug,
  icon,
  categoryId,
  name,
  catLabel,
  delay,
}: {
  href: string;
  slug: string;
  icon: FeaturedApp["icon"];
  categoryId: string;
  name: string;
  catLabel: string;
  delay: number;
}) {
  const c = CHIP[categoryId];
  return (
    <ToolTile
      href={href}
      slug={slug}
      icon={icon}
      name={name}
      catLabel={catLabel}
      chipBg={c?.bg}
      chipFg={c?.fg}
      className={s.enter}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    />
  );
}

/* ---------- featured app vignette ---------- */

function AppViz({ viz }: { viz: FeaturedApp["viz"] }) {
  if (viz === "wave")
    return (
      <div className={s.appViz}>
        <div className={s.vizRow} style={{ top: 12, width: "55%" }} />
        <div className={s.vizRow} style={{ top: 28, width: "70%" }} />
        <div className={s.vizWave}>
          {Array.from({ length: 24 }, (_, i) => (
            <span
              key={i}
              className={s.vizBar}
              style={{
                height: `${30 + 60 * Math.abs(Math.sin(i * 1.7))}%`,
                animationDelay: `${i * 55}ms`,
              }}
            />
          ))}
        </div>
      </div>
    );
  if (viz === "chat")
    return (
      <div className={s.appViz}>
        <div
          className={s.vizChip}
          style={{ top: 14, insetInlineStart: 10, width: "52%", height: 20, borderRadius: 8 }}
        />
        <div
          className={`${s.vizChip} ${s.vizAccent}`}
          style={{ top: 40, insetInlineEnd: 10, width: "42%", height: 20, borderRadius: 8 }}
        />
        <div
          className={s.vizChip}
          style={{ top: 66, insetInlineStart: 10, width: "60%", height: 20, borderRadius: 8 }}
        />
      </div>
    );
  return (
    <div className={s.appViz}>
      <div className={s.vizRow} style={{ top: 14, width: "40%" }} />
      <div className={s.vizRow} style={{ top: 34, width: "78%" }} />
      <div className={s.vizRow} style={{ top: 50, width: "78%" }} />
      <div
        className={`${s.vizChip} ${s.vizAccent}`}
        style={{ bottom: 12, insetInlineEnd: 10, width: 60, height: 14 }}
      />
    </div>
  );
}

/* ---------- live on-device demo (ported from ui.tsx) ---------- */

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function formatKB(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function compressImage(file: File, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encode failed"))),
      "image/webp",
      quality,
    ),
  );
}

function LiveDemo() {
  const t = useTranslations("Landing");
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<{ saved: number; pct: number } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedAnimated = useCountUp(result?.saved ?? 0);

  const handle = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const blob = await compressImage(file, 0.72);
      const saved = Math.max(0, file.size - blob.size);
      setResult({ saved, pct: Math.round((saved / file.size) * 100) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`${s.demo} ${dragging ? s.demoDragging : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files[0]);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <div>
        <div className={s.demoLabel}>
          {busy ? t("demoTitleBusy") : t("demoTitle")}
        </div>
        <div className={s.demoSub}>{t("demoSub")}</div>
      </div>
      {result && (
        <div className={s.demoResult}>
          <span className={s.demoBig}>−{formatKB(savedAnimated)}</span>
          <span className={s.demoSmall}>{t("demoSmaller", { pct: result.pct })}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- tool row (favorites / recent) ---------- */

function ToolRow({
  label,
  items,
}: {
  label: string;
  items: { href: string; slug: string; icon: FeaturedApp["icon"]; categoryId: string; name: string; catLabel: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <>
      <div className={s.sectionLabel}>
        {label} <span className={s.sectionRule} />
      </div>
      <div className={s.grid}>
        {items.map((it, i) => (
          <Tile key={it.href} {...it} delay={Math.min(i * 18, 200)} />
        ))}
      </div>
    </>
  );
}

/* ---------- landing ---------- */

export default function Landing() {
  const t = useTranslations("Landing");
  const tc = useTranslations("ToolsConfig");
  const [category, setCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { getFavoriteTools } = useFavoritesStore();
  const { getRecentTools } = useRecentToolsStore();

  useEffect(() => setMounted(true), []);

  /* Translated + locale-sorted catalog for the Popular grid. */
  const catalog = useMemo(
    () =>
      TOOL_INDEX.map((tool) => ({
        ...tool,
        name: tc(`tools.${tool.slug}.name` as never) as string,
        catLabel: tc(`categoriesShort.${tool.categoryId}` as never) as string,
      })).sort((a, b) => a.name.localeCompare(b.name)),
    [tc],
  );

  const popular = useMemo(
    () =>
      category
        ? catalog.filter((tool) => tool.categoryId === category)
        : catalog.slice(0, POPULAR_LIMIT),
    [category, catalog],
  );

  /* Favorites / recent — client-only (persisted stores) to avoid a mismatch. */
  const rows = useMemo(() => {
    if (!mounted) return { favorites: [], recent: [] };
    const byHref = new Map(catalog.map((c) => [c.href, c]));
    const allTools = getAllTools();
    const resolve = (list: { href: string }[]) =>
      list.map((tool) => byHref.get(tool.href)).filter(Boolean) as typeof catalog;
    return {
      favorites: resolve(getFavoriteTools(allTools)),
      recent: resolve(getRecentTools(allTools)),
    };
  }, [mounted, catalog, getFavoriteTools, getRecentTools]);

  return (
    <div className={s.canvas} data-mounted={mounted}>
      <div
        className={`${s.topRow} ${s.enter}`}
        style={{ "--d": "0ms" } as React.CSSProperties}
      >
        <h1 className={s.statement}>
          {t("statementLead")}{" "}
          <span className={s.statementMuted}>{t("statementTail")}</span>
        </h1>
        <a className={s.pill} href="/coffee">
          <CoffeeIcon size={13} className={s.coffeeIcon} />
          {t("coffee")}
        </a>
      </div>

      <div className={s.enter} style={{ "--d": "40ms" } as React.CSSProperties}>
        <button
          type="button"
          className={s.searchBar}
          onClick={openCommandPalette}
          aria-label={t("searchPlaceholder", { count: TOOL_COUNT })}
        >
          <span>{t("searchPlaceholder", { count: TOOL_COUNT })}</span>
          <span className={s.kbd}>⌘K</span>
        </button>
      </div>

      <div className={s.enter} style={{ "--d": "80ms" } as React.CSSProperties}>
        <LiveDemo />
      </div>

      {/* Favorites / recently used (client-only, non-empty only). */}
      <ToolRow label={t("favorites")} items={rows.favorites} />
      <ToolRow label={t("recent")} items={rows.recent} />

      {/* Featured apps — live routes only. */}
      <div className={s.sectionLabel}>
        {t("apps")} <span className={s.sectionRule} />
      </div>
      <div className={s.apps}>
        {FEATURED_APPS.map((app) => {
          const Icon = app.icon;
          return (
            <Link key={app.slug} href={app.href} className={s.appCard}>
              <AppViz viz={app.viz} />
              <div className={s.appBody}>
                <div className={s.appName}>
                  {tc(`tools.${app.slug}.name` as never)}
                </div>
                <div className={s.appDesc}>
                  {tc(`tools.${app.slug}.description` as never)}
                </div>
                <div className={s.appMeta}>
                  <span className={s.onDevice}>
                    <span className={s.liveDot} /> {t("onDevice")}
                  </span>
                  <span className={s.appArrow} aria-hidden>
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Popular curated grid + category filters. */}
      <div className={s.sectionLabel}>
        {category
          ? tc(`categoriesShort.${category}` as never)
          : t("popular")}
        <span className={s.sectionRule} />
      </div>

      <div className={s.filters}>
        <button
          type="button"
          className={category === null ? s.filterActive : s.filter}
          onClick={() => setCategory(null)}
        >
          {t("all")}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={category === c.id ? s.filterActive : s.filter}
            onClick={() => setCategory(c.id)}
          >
            {tc(`categoriesShort.${c.id}` as never)}
          </button>
        ))}
      </div>

      <div className={s.grid}>
        {popular.map((tool, i) => (
          <Tile
            key={tool.href}
            href={tool.href}
            slug={tool.slug}
            icon={tool.icon}
            categoryId={tool.categoryId}
            name={tool.name}
            catLabel={tool.catLabel}
            delay={Math.min(360 + i * 18, 700)}
          />
        ))}
      </div>

      {/* Full-catalog crawlable surface — every tool, grouped by category. */}
      <div className={s.sectionLabel}>
        {t("allTools", { count: TOOL_COUNT })} <span className={s.sectionRule} />
      </div>
      <div className={s.allSection}>
        {GROUPED.map((cat) => (
          <section key={cat.id} className={s.allCategory}>
            <h2 className={s.allHead}>{tc(`categories.${cat.id}` as never)}</h2>
            <div className={s.grid}>
              {cat.items.map((item) => (
                <ToolTile
                  key={item.href}
                  href={item.href}
                  slug={item.slug}
                  icon={item.icon}
                  name={tc(`tools.${item.slug}.name` as never)}
                  catLabel={tc(`categoriesShort.${cat.id}` as never)}
                  chipBg={CHIP[cat.id]?.bg}
                  chipFg={CHIP[cat.id]?.fg}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <HomeFAQ />
    </div>
  );
}
