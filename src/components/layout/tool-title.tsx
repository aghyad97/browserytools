"use client";

/**
 * Per-tool title block for the tools shell.
 *
 * The retired Header rendered the current tool's name as the page <h1>; the
 * rail (a nav shell) does not, so every tool page must recover that heading
 * here (spec §6.4 — the rail "must absorb" the Header's functions). Derives the
 * tool from the pathname and resolves its localized name via ToolsConfig, with
 * the category as a mono eyebrow. Renders nothing off a known tool route.
 */

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { tools } from "@/lib/tools-config";
import s from "./tool-title.module.css";

/* slug -> category id, for every catalogued tool. */
const SLUG_CATEGORY = new Map(
  tools.flatMap((c) =>
    c.items.map((t) => [t.href.split("/").pop() as string, c.id] as const),
  ),
);

export function ToolTitle() {
  const pathname = usePathname();
  const tc = useTranslations("ToolsConfig");

  const slug = pathname?.startsWith("/tools/")
    ? pathname.split("/")[2]
    : undefined;
  const categoryId = slug ? SLUG_CATEGORY.get(slug) : undefined;
  if (!slug || !categoryId) return null;

  return (
    <div className={s.wrap}>
      <span className={s.eyebrow}>
        {tc(`categoriesShort.${categoryId}` as never)}
      </span>
      <h1 className={s.title}>{tc(`tools.${slug}.name` as never)}</h1>
    </div>
  );
}
