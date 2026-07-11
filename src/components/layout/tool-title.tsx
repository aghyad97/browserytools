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

/* Tools whose component already renders its own <h1> — ToolTitle must not add
   a second one (the smoke suite enforces exactly one h1 per route). Derived by
   scanning each tool's page.tsx + imported @/components tree for `<h1`;
   grows as tools migrate to the five-zone template (which owns the title) —
   an adopting tool adds its slug here so ToolTitle stands down. */
const HAS_OWN_H1 = new Set([
  "aspect-ratio",
  "audio",
  "audio-transcriber",
  "bmi-calculator",
  "code-screenshot",
  "color-blindness",
  "contrast-checker",
  "css-minifier",
  "depth-map",
  "emoji-picker",
  "exif-remover",
  "exif-viewer",
  "fake-data",
  "file-converter",
  "habit-tracker",
  "html-formatter",
  "http-status",
  "image-captioner",
  // Five-zone ToolShell pilots (R2): the shell owns the page <h1>.
  "image-compression",
  "image-upscaler",
  // R2 batch B1: Image Tools migrated onto ToolShell (the shell owns the h1).
  "ascii-art",
  "bg-removal",
  "color-correction",
  "favicon-generator",
  "image-color-picker",
  "image-converter",
  "image-resizer",
  "meme-generator",
  "photo-censor",
  "photo-collage",
  "phone-mockups",
  "screenshot-beautifier",
  "svg-png",
  "json-formatter",
  // NOT "invoice": its own <h1> sits inside the Radix "preview" tab, which is
  // not in the DOM at load (default tab is "details") — ToolTitle must supply
  // the page h1.
  "keep-awake",
  "loan-calculator",
  // markdown-editor: no literal <h1> in source, but its ReactMarkdown preview
  // renders SAMPLE_MARKDOWN ("# Welcome…") as an <h1> at load.
  "markdown-editor",
  "notepad",
  "object-cutout",
  "percentage-calculator",
  "pii-redactor",
  "pomodoro",
  "roman-numeral",
  "screen-recorder",
  "sentiment-analyzer",
  "signature-maker",
  "sql-formatter",
  "stopwatch",
  "svg",
  "text-summarizer",
  "text-to-speech",
  "timer",
  "tip-calculator",
  "translator",
  "world-clock",
  "zero-shot-classifier",
]);

export function ToolTitle() {
  const pathname = usePathname();
  const tc = useTranslations("ToolsConfig");

  const slug = pathname?.startsWith("/tools/")
    ? pathname.split("/")[2]
    : undefined;
  const categoryId = slug ? SLUG_CATEGORY.get(slug) : undefined;
  if (!slug || !categoryId || HAS_OWN_H1.has(slug)) return null;

  return (
    <div className={s.wrap}>
      <span className={s.eyebrow}>
        {tc(`categoriesShort.${categoryId}` as never)}
      </span>
      <h1 className={s.title}>{tc(`tools.${slug}.name` as never)}</h1>
    </div>
  );
}
