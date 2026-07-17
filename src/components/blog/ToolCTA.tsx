"use client";

/**
 * Reusable end-of-post (and top-of-post) call-to-action linking a blog post
 * to its matching tool. Blog posts today only mention their tool as plain
 * inline text — this component fixes the presentation once so later work can
 * drop it into every post without redesigning anything per-post.
 *
 * Name/description come from the EXISTING `ToolsConfig.tools.<slug>` i18n
 * keys (already translated in all 9 locales for the tool grid/tiles), so the
 * CTA self-localizes with zero per-tool translation work. Only one new key
 * was added: `Blog.openTool`.
 *
 * An unknown/mistyped slug renders nothing — a blog post's CTA must never be
 * able to crash the page.
 */

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CHIP } from "@/lib/category-chips";
import { getAllTools, tools as toolCategories } from "@/lib/tools-config";

export interface ToolCTAProps {
  /** Tool slug, e.g. "keep-awake" — resolved via `getAllTools()` matching
   * `href === "/tools/<slug>"`. Unknown slugs render nothing. */
  slug: string;
  /** "card" (default) = prominent end-of-post block.
   *  "inline" = slimmer top-of-post bar. */
  variant?: "card" | "inline";
}

export function ToolCTA({ slug, variant = "card" }: ToolCTAProps) {
  const tc = useTranslations("ToolsConfig");
  const tBlog = useTranslations("Blog");

  const href = `/tools/${slug}`;
  const tool = getAllTools().find((t) => t.href === href);
  if (!tool) return null;

  const Icon = tool.icon as LucideIcon;
  // getAllTools() carries the category's display name (e.g. "Productivity
  // Tools"), not its id — CHIP is keyed by id (same map ToolTile uses via
  // tool.categoryId in landing.tsx), so cross-reference the category list
  // once to recover it.
  const categoryId = toolCategories.find((c) => c.category === tool.category)?.id;
  const chip = categoryId ? CHIP[categoryId] : undefined;

  const name = tc(`tools.${slug}.name` as never);
  const description = tc(`tools.${slug}.description` as never);
  const openTool = tBlog("openTool");

  const iconWrap = (sizeClass: string, iconSizeClass: string) => (
    <span
      aria-hidden
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-lg`}
      style={{ background: chip?.bg ?? "var(--bt-fill)", color: chip?.fg ?? "var(--bt-muted)" }}
    >
      <Icon strokeWidth={1.8} className={iconSizeClass} />
    </span>
  );

  if (variant === "inline") {
    return (
      <Link
        href={href}
        data-testid="tool-cta"
        data-variant="inline"
        data-slug={slug}
        className="flex items-center gap-3 rounded-xl border border-[var(--bt-line)] bg-[var(--bt-surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--bt-line-strong)]"
      >
        {iconWrap("h-9 w-9", "h-4 w-4")}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--bt-ink)]">{name}</span>
          <span className="block truncate text-xs text-[var(--bt-muted)]">{description}</span>
        </span>
        <span className="ms-auto shrink-0 whitespace-nowrap text-xs font-medium text-[var(--bt-accent)]">
          {openTool}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      data-testid="tool-cta"
      data-variant="card"
      data-slug={slug}
      className="flex flex-col gap-4 rounded-xl border border-[var(--bt-line)] bg-[var(--bt-surface)] p-5 no-underline transition-colors hover:border-[var(--bt-line-strong)] sm:flex-row sm:items-center"
    >
      {iconWrap("h-11 w-11", "h-5 w-5")}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-[var(--bt-ink)]">{name}</span>
        <span className="mt-1 block text-sm text-[var(--bt-muted)]">{description}</span>
      </span>
      <span className="shrink-0 whitespace-nowrap text-sm font-medium text-[var(--bt-accent)] sm:ms-auto">
        {openTool}
      </span>
    </Link>
  );
}
