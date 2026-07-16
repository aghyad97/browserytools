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
 *                                         // (or Template.networkNote when the
 *                                         // tools-config entry sets onDevice: false)
 *     controls={<Quality … />}           // zone 4 — ControlsBar children
 *     primaryAction={{ label, onClick, disabled }}  // single dark pill, end-aligned
 *   >
 *     {stage}                            // zone 3 — the tool's primary surface
 *   </ToolShell>
 *
 * Zones: 1 Crumb (mono CATEGORY eyebrow in its chip fg) → 2 Title+sub
 * (sub always ends with the on-device promise, or the network note for tools
 * whose tools-config entry sets onDevice: false) → 3 Stage (max-width 880) →
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
import { tools, getRelatedTools } from "@/lib/tools-config";
import { ToolTile } from "@/components/shared/ToolTile";
import { CHIP } from "@/lib/category-chips";
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
  /** Shell width. "wide" widens the stage to 1180px for tools whose primary
   *  surface needs the room (spec §F2); default stays 880. */
  width?: "default" | "wide";
}

/* slug -> category id, and slug -> on-device flag. Built once from the shared
   config; never mutated. Related tiles are resolved by getRelatedTools (which
   is landing-variant aware — see tools-config.ts). */
const SLUG_CATEGORY = new Map<string, string>();
const SLUG_ON_DEVICE = new Map<string, boolean>();
for (const category of tools) {
  for (const tool of category.items) {
    const slug = tool.href.split("/").pop() as string;
    SLUG_CATEGORY.set(slug, category.id);
    SLUG_ON_DEVICE.set(slug, tool.onDevice !== false);
  }
}

export function ToolShell({
  slug,
  title,
  sub,
  controls,
  primaryAction,
  children,
  width = "default",
}: ToolShellProps) {
  const tc = useTranslations("ToolsConfig");
  const tt = useTranslations("Template");

  const categoryId = SLUG_CATEGORY.get(slug);
  const chip = categoryId ? CHIP[categoryId] : undefined;
  const catShort = categoryId
    ? (tc(`categoriesShort.${categoryId}` as never) as string)
    : "";

  // 3 related tiles (spec §3). For a normal tool: same-category siblings,
  // excluding itself and any SEO landing variant. For a landing tool: its
  // canonical tool first, then sibling variants sharing the same landingFor.
  const related = getRelatedTools(slug, 3);

  const isOnDevice = SLUG_ON_DEVICE.get(slug) ?? true;
  const promise = isOnDevice ? tt("onDevicePromise") : tt("networkNote");
  const subLine = sub ? `${sub} ${promise}` : promise;

  return (
    <div
      className={width === "wide" ? `${s.shell} ${s.shellWide}` : s.shell}
      data-width={width}
    >
      {/* zone 1 · crumb — category-only eyebrow (design ruling: the tool name
          would exactly duplicate the h1 below, so the crumb carries only the
          mono category label in its chip colour). */}
      <div className={s.crumb} data-testid="tool-shell-crumb">
        <span
          className={s.crumbCat}
          data-testid="tool-shell-crumb-cat"
          style={{ "--crumb-fg": chip?.fg } as React.CSSProperties}
        >
          {catShort}
        </span>
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
                description={tc(`tools.${r.slug}.description` as never) as string}
                chipBg={chip?.bg}
                chipFg={chip?.fg}
                creationDate={r.creationDate}
                testId="tool-shell-related-tile"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
