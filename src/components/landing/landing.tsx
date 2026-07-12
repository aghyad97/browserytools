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
import { useTranslations } from "next-intl";
import { tools, getAllTools } from "@/lib/tools-config";
import { FEATURED_APPS, type FeaturedApp } from "@/lib/featured-apps";
import { routeFile, extOf, type RouteMatch } from "@/lib/file-router";
import { playCue } from "@/lib/ui-sound";
import { openCommandPalette } from "@/components/layout/command-palette";
import { useFavoritesStore } from "@/store/favorites-store";
import { useRecentToolsStore } from "@/store/recent-tools-store";
import { useCategoryFilterStore } from "@/store/category-filter-store";
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
  description,
}: {
  href: string;
  slug: string;
  icon: FeaturedApp["icon"];
  categoryId: string;
  name: string;
  catLabel: string;
  description?: string;
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
      description={description}
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
                // Quantize to 2 decimals: Math.sin is transcendental and only
                // defined to ~1 ULP, so the dev server's V8 and the browser's V8
                // format the raw float differently → hydration mismatch. Rounding
                // to a fixed precision makes both sides emit an identical string.
                height: `${(30 + 60 * Math.abs(Math.sin(i * 1.7))).toFixed(2)}%`,
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

/* ---------- live on-device demo + whole-landing dropzone ---------- */

/* slug → tile metadata for the drop-suggestion tiles. */
const BY_SLUG = new Map(TOOL_INDEX.map((tool) => [tool.slug, tool]));

/* Mirrors the reduced-motion probe in @/lib/ui-sound (not exported there).
   Replicated locally so the count-up can skip animating for users who opted
   out of motion. */
function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches === true
    );
  } catch {
    return false;
  }
}

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }
    if (prefersReducedMotion()) {
      setValue(target);
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

/**
 * Universal dropzone + live demo. The WHOLE landing is the drop target
 * (window-level drag listeners show a full-canvas overlay); the demo box is
 * the click-to-browse entry point. Dropped/picked files route by kind:
 *   - images (non-SVG) keep the on-device compression demo, inline;
 *   - everything else gets ranked tool suggestions from src/lib/file-router
 *     (shown as tiles below the box — deliberately NO auto-navigation and NO
 *     cross-route file handoff; tools read their own inputs).
 * Drop handling is client-only by nature; the static box copy still SSRs.
 */
function LiveDemo() {
  const t = useTranslations("Landing");
  const tc = useTranslations("ToolsConfig");
  const tRail = useTranslations("Rail");
  const [overlay, setOverlay] = useState(false);
  const [result, setResult] = useState<{ saved: number; pct: number } | null>(
    null,
  );
  const [routed, setRouted] = useState<{ name: string; ext: string; match: RouteMatch } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedAnimated = useCountUp(result?.saved ?? 0);

  const handle = async (file?: File) => {
    if (!file) return;
    // Every drop gets routed suggestions — raster images ALSO run the live
    // compress demo alongside them (suggestions alone read as "nothing
    // happened" for the demo's own file type).
    setRouted({
      name: file.name,
      ext: extOf(file.name) || file.type.split("/").pop() || "file",
      match: routeFile(file.name, file.type),
    });
    playCue("tick");
    if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      setBusy(true);
      try {
        const blob = await compressImage(file, 0.72);
        const saved = Math.max(0, file.size - blob.size);
        setResult({ saved, pct: Math.round((saved / file.size) * 100) });
      } finally {
        setBusy(false);
      }
      return;
    }
    setResult(null);
  };

  /* Whole-landing drop target: window-level listeners (the landing is the
     only mount site) with an enter/leave counter so nested drags don't
     flicker the overlay. Files only — text drags don't trigger it. */
  useEffect(() => {
    let depth = 0;
    const hasFiles = (e: DragEvent) =>
      Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const enter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth += 1;
      setOverlay(true);
    };
    const over = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault(); // required to allow the drop
    };
    const leave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setOverlay(false);
    };
    const drop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      setOverlay(false);
      handle(e.dataTransfer?.files[0]);
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestions = routed
    ? (routed.match.slugs
        .map((slug) => BY_SLUG.get(slug))
        .filter(Boolean) as NonNullable<ReturnType<typeof BY_SLUG.get>>[])
    : [];

  return (
    <>
      <div
        className={`${s.demo} ${overlay ? s.demoDragging : ""}`}
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
          hidden
          onChange={(e) => handle(e.target.files?.[0])}
        />
        <div>
          <div className={s.demoLabel}>
            {busy ? t("demoTitleBusy") : t("dropAnyFile")}
          </div>
          <div className={s.demoSub}>{t("dropSuggest")}</div>
        </div>
        {result && (
          <div className={s.demoResult}>
            <span className={s.demoBig}>−{formatKB(savedAnimated)}</span>
            <span className={s.demoSmall}>{t("demoSmaller", { pct: result.pct })}</span>
          </div>
        )}
      </div>

      {/* Ranked tool suggestions for a non-image drop (file-router). */}
      {routed && suggestions.length > 0 && (
        <div className={s.suggestPanel} data-testid="drop-suggestions">
          <div className={s.suggestHead}>
            <span className={s.extBadge}>{routed.ext}</span>
            <span className={s.suggestName}>{routed.name}</span>
            <button
              type="button"
              className={s.suggestSearch}
              onClick={openCommandPalette}
            >
              {tRail("search")} ⌘K
            </button>
          </div>
          <div className={s.grid}>
            {suggestions.map((tool) => (
              <ToolTile
                key={tool.href}
                href={tool.href}
                slug={tool.slug}
                icon={tool.icon}
                name={tc(`tools.${tool.slug}.name` as never)}
                catLabel={tc(`categoriesShort.${tool.categoryId}` as never)}
                chipBg={CHIP[tool.categoryId]?.bg}
                chipFg={CHIP[tool.categoryId]?.fg}
              />
            ))}
          </div>
        </div>
      )}

      {/* Full-canvas drop overlay — pointer-events:none so the drop still
          lands on the window listeners. */}
      {overlay && (
        <div className={s.dropOverlay} aria-hidden>
          <div className={s.dropOverlayInner}>
            <div className={s.dropTitle}>{t("dropAnyFile")}</div>
            <div className={s.dropSub}>{t("dropSuggest")}</div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- tool row (favorites / recent) ---------- */

function ToolRow({
  label,
  items,
}: {
  label: string;
  items: { href: string; slug: string; icon: FeaturedApp["icon"]; categoryId: string; name: string; catLabel: string; description?: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className={s.lateRow}>
      <div className={s.sectionLabel}>
        {label} <span className={s.sectionRule} />
      </div>
      <div className={s.grid}>
        {items.map((it) => (
          <Tile key={it.href} {...it} />
        ))}
      </div>
    </div>
  );
}

/* ---------- landing ---------- */

export default function Landing() {
  const t = useTranslations("Landing");
  const tc = useTranslations("ToolsConfig");
  const { category, setCategory } = useCategoryFilterStore();
  const [mounted, setMounted] = useState(false);

  const { getFavoriteTools } = useFavoritesStore();
  const { getRecentTools } = useRecentToolsStore();

  useEffect(() => setMounted(true), []);

  /* Filter continuity: the Popular grid re-orders instantly on a filter click.
     Bump a nonce on every category CHANGE (never the first render) so the grid
     remounts and replays a brief opacity dip — a soft flush that signals the
     content swapped rather than a jarring hard snap. Reduced-motion: instant
     (the .canvas * animation:none rule zeroes it). */
  const [filterNonce, setFilterNonce] = useState(0);
  const filterMounted = useRef(false);
  useEffect(() => {
    if (!filterMounted.current) {
      filterMounted.current = true;
      return;
    }
    setFilterNonce((n) => n + 1);
  }, [category]);

  /* Translated + locale-sorted catalog for the Popular grid. */
  const catalog = useMemo(
    () =>
      TOOL_INDEX.map((tool) => ({
        ...tool,
        name: tc(`tools.${tool.slug}.name` as never) as string,
        catLabel: tc(`categoriesShort.${tool.categoryId}` as never) as string,
        description: tc(`tools.${tool.slug}.description` as never) as string,
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
    <div className={s.canvas}>
      <div className={s.topRow}>
        <h1 className={s.statement}>
          {t("statementLead")}{" "}
          <span className={s.statementMuted}>{t("statementTail")}</span>
        </h1>
      </div>

      <LiveDemo />

      {/* Favorites / recently used (client-only, non-empty only). */}
      <ToolRow label={t("favorites")} items={rows.favorites} />
      <ToolRow label={t("recent")} items={rows.recent} />

      {/* Featured apps — live routes only. Renders fully visible at first paint. */}
      <div>
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

      <div
        key={filterNonce}
        className={`${s.grid}${filterNonce > 0 ? ` ${s.gridDip}` : ""}`}
        data-testid="popular-grid"
      >
        {popular.map((tool) => (
          <Tile
            key={tool.href}
            href={tool.href}
            slug={tool.slug}
            icon={tool.icon}
            categoryId={tool.categoryId}
            name={tool.name}
            catLabel={tool.catLabel}
            description={tool.description}
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
