"use client";

/**
 * Five-zone tool template (spec §3). Every one of the 137 tools adopts this in
 * the R2 migration batches; a tool renders its primary surface as the children
 * and hands the shell its translated strings + a single primary action:
 *
 *   <ToolShell
 *     slug="image-compression"          // resolves category, colours, crumb, related
 *     title={t("title")}                 // verb-first tool title (the page <h1>)
 *     sub={t("sub")}                     // shell appends Template.onDevicePromise
 *     controls={<Quality … />}           // zone 4 — ControlsBar children
 *     primaryAction={{ label, onClick, disabled }}  // single dark pill, end-aligned
 *   >
 *     {stage}                            // zone 3 — the tool's primary surface
 *   </ToolShell>
 *
 * Zones: 1 Crumb (mono CATEGORY / TOOL, category in its chip fg) → 2 Title+sub
 * (sub always ends with the on-device promise) → 3 Stage (max-width 880) →
 * 4 ControlsBar → 5 Related (3 same-category tiles, the shared landing tile).
 * ToolSeoContent is the rest of zone 5 and is rendered once by the tools layout
 * (never duplicated here).
 *
 * The shell owns the page <h1> (zone 2). A tool that adopts it must be added to
 * HAS_OWN_H1 in components/layout/tool-title.tsx so ToolTitle stands down and
 * the exactly-one-h1 smoke gate stays green.
 *
 * Binding: all colours via var(--bt-*) tokens (light+dark), logical properties
 * throughout (RTL mirrors for free), existing i18n keys only.
 */

import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-config";
import { ToolTile } from "@/components/shared/ToolTile";
import { ControlsBar } from "./controls-bar";
import s from "./tool-shell.module.css";

export interface PrimaryAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface ToolShellProps {
  /** tools-config slug — resolves category, colours, crumb, and related. */
  slug: string;
  /** Verb-first tool title; becomes the page <h1> (zone 2). */
  title: string;
  /** Author sub; the shell appends the on-device promise. */
  sub?: string;
  /** Zone 4 controls (ControlsBar children). */
  controls?: React.ReactNode;
  /** The single dark-pill primary action, end-aligned in the controls bar. */
  primaryAction?: PrimaryAction;
  /** Zone 3 — the tool's primary surface. */
  children: React.ReactNode;
}

/* Per-category chip colours — token references only (light+dark handled by the
   token layer). Keyed by tools-config category id. */
const CHIP: Record<string, { bg: string; fg: string }> = {
  imageTools: { bg: "var(--bt-cat-image-bg)", fg: "var(--bt-cat-image-fg)" },
  fileTools: { bg: "var(--bt-cat-file-bg)", fg: "var(--bt-cat-file-fg)" },
  mediaTools: { bg: "var(--bt-cat-media-bg)", fg: "var(--bt-cat-media-fg)" },
  textLanguage: { bg: "var(--bt-cat-text-bg)", fg: "var(--bt-cat-text-fg)" },
  dataTools: { bg: "var(--bt-cat-data-bg)", fg: "var(--bt-cat-data-fg)" },
  mathFinance: { bg: "var(--bt-cat-math-bg)", fg: "var(--bt-cat-math-fg)" },
  productivity: { bg: "var(--bt-cat-prod-bg)", fg: "var(--bt-cat-prod-fg)" },
  devTools: { bg: "var(--bt-cat-dev-bg)", fg: "var(--bt-cat-dev-fg)" },
  designTools: { bg: "var(--bt-cat-design-bg)", fg: "var(--bt-cat-design-fg)" },
  securityTools: { bg: "var(--bt-cat-sec-bg)", fg: "var(--bt-cat-sec-fg)" },
  aiTools: { bg: "var(--bt-cat-ai-bg)", fg: "var(--bt-cat-ai-fg)" },
};

interface RelatedEntry {
  slug: string;
  href: string;
  icon: (typeof tools)[number]["items"][number]["icon"];
}

/* slug -> category id, and category id -> its (available) tools. Built once from
   the shared config; never mutated. */
const SLUG_CATEGORY = new Map<string, string>();
const CATEGORY_TOOLS = new Map<string, RelatedEntry[]>();
for (const category of tools) {
  const entries: RelatedEntry[] = [];
  for (const tool of category.items) {
    const slug = tool.href.split("/").pop() as string;
    SLUG_CATEGORY.set(slug, category.id);
    if (tool.available) {
      entries.push({ slug, href: tool.href, icon: tool.icon });
    }
  }
  CATEGORY_TOOLS.set(category.id, entries);
}

export function ToolShell({
  slug,
  title,
  sub,
  controls,
  primaryAction,
  children,
}: ToolShellProps) {
  const tc = useTranslations("ToolsConfig");
  const tt = useTranslations("Template");

  const categoryId = SLUG_CATEGORY.get(slug);
  const chip = categoryId ? CHIP[categoryId] : undefined;
  const catShort = categoryId
    ? (tc(`categoriesShort.${categoryId}` as never) as string)
    : "";
  const toolName = tc(`tools.${slug}.name` as never) as string;

  // 3 same-category siblings (excluding the current tool). Reuses the landing
  // tile visual (spec §3).
  const related = (categoryId ? CATEGORY_TOOLS.get(categoryId) ?? [] : [])
    .filter((t) => t.slug !== slug)
    .slice(0, 3);

  const promise = tt("onDevicePromise");
  const subLine = sub ? `${sub} ${promise}` : promise;

  return (
    <div className={s.shell}>
      {/* zone 1 · crumb */}
      <div className={s.crumb} data-testid="tool-shell-crumb">
        <span
          className={s.crumbCat}
          data-testid="tool-shell-crumb-cat"
          style={{ "--crumb-fg": chip?.fg } as React.CSSProperties}
        >
          {catShort}
        </span>
        {catShort ? " / " : null}
        <span className={s.crumbName}>{toolName}</span>
      </div>

      {/* zone 2 · title + sub (sub always ends with the on-device promise) */}
      <h1 className={s.title}>{title}</h1>
      <p className={s.sub}>{subLine}</p>

      {/* zone 3 · stage — the tool's primary surface */}
      <div className={s.stage}>{children}</div>

      {/* zone 4 · controls bar */}
      {(controls || primaryAction) && (
        <ControlsBar primaryAction={primaryAction}>{controls}</ControlsBar>
      )}

      {/* zone 5 · related (SEO content block is rendered by the tools layout) */}
      {related.length > 0 && (
        <>
          <div className={s.sectionLabel}>
            {tt("related")} <span className={s.sectionRule} />
          </div>
          <div className={s.grid} data-testid="tool-shell-related">
            {related.map((r) => (
              <ToolTile
                key={r.href}
                href={r.href}
                slug={r.slug}
                icon={r.icon}
                name={tc(`tools.${r.slug}.name` as never) as string}
                catLabel={catShort}
                chipBg={chip?.bg}
                chipFg={chip?.fg}
                testId="tool-shell-related-tile"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
