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
   an adopting tool adds its slug here so ToolTitle stands down.
   As of R2 every catalogued tool is listed, so ToolTitle renders nothing today;
   it remains as the safety net for future tools added without ToolShell. */
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
  // "invoice" was excluded pre-B4 (its own <h1> hid inside an inactive Radix
  // tab); it joined the set when B4 wrapped it in ToolShell — listed below.
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
  // R2 batch B2: AI Tools migrated onto ToolShell (the shell owns the h1).
  "ai-cost-calculator",
  "ai-instruction-diff",
  "ai-rules-generator",
  "claude-md-generator",
  "context-window",
  "json-schema-builder",
  "mcp-config",
  "model-comparison",
  "prompt-formatter",
  "prompt-library",
  "skill-builder",
  "system-prompt-builder",
  "text-similarity",
  "token-counter",
  // R2 batch B3: Text & Language Tools migrated onto ToolShell (the shell owns
  // the h1). markdown-editor is intentionally absent: it renders its sample
  // markdown's "# …" as a preview <h1> at load, so adopting the shell would
  // yield two h1s — it stays on ToolTitle (already listed above).
  "code-format",
  "image-to-text",
  "lorem-ipsum",
  "markdown-html",
  "markdown-table",
  "morse-code",
  "rich-editor",
  "speech-to-text",
  "text-case",
  "text-counter",
  "text-diff",
  "text-repeater",
  "text-sorter",
  "typing-test",
  "word-frequency",
  // R2 batch B4: Math & Finance + File Tools migrated onto ToolShell (the shell
  // owns the h1). Slugs already listed above (aspect-ratio, bmi-calculator,
  // loan-calculator, percentage-calculator, roman-numeral, tip-calculator) had
  // their own h1 before and are unchanged here.
  "age-calculator",
  "calculator",
  "number-base-converter",
  "unit-converter",
  "timezone-converter",
  "currency-converter",
  "expense-tracker",
  "periodic-table",
  "invoice",
  "pdf",
  "zip",
  "spreadsheet",
  // R2 batch B5: Data + Media Tools migrated onto ToolShell (the shell owns the
  // h1). fake-data, audio and screen-recorder were already listed above (they
  // rendered their own h1 pre-migration) and are unchanged here.
  "json-csv",
  "base64",
  "qr-generator",
  "barcode-generator",
  "qr-scanner",
  "barcode-scanner",
  "charts",
  "yaml-json",
  "url-encoder",
  "text-binary",
  "json-to-ts",
  "mermaid",
  "video",
  "mic-camera",
  "compress-video",
  "gif-maker",
  // R2 batch B6: Productivity + Developer Tools migrated onto ToolShell (the
  // shell owns the h1). pomodoro, world-clock, stopwatch, habit-tracker,
  // keep-awake, css-minifier, http-status and sql-formatter were already listed
  // above (they rendered their own h1 pre-migration) and are unchanged here.
  "todo",
  "uuid-generator",
  "unix-timestamp",
  "chmod",
  "regex-tester",
  "cron-parser",
  "meta-tags",
  "curl-converter",
  // R2 batch B7 (final): Design + Security Tools migrated onto ToolShell (the
  // shell owns the h1). contrast-checker, emoji-picker and code-screenshot were
  // already listed above (they rendered their own h1 pre-migration) and stay
  // unchanged there.
  "css-shadow",
  "cubic-bezier",
  "css-gradient",
  "color-palette",
  "color-converter",
  "clip-path-generator",
  "glassmorphism-generator",
  "svg-blob-generator",
  "og-image-generator",
  "jwt-decoder",
  "password-generator",
  "hash-generator",
  "password-strength",
  "text-encryption",
  // B7 also swept three Productivity tools that predate B6 and were missed by
  // it (they were never in B6's derived scope): the shell now owns their h1.
  // signature-maker was already listed above (it rendered its own h1); mind-map
  // and random-picker previously relied on ToolTitle for the page h1.
  "mind-map",
  "random-picker",
  // Wave 1 (W1) Task 3: registry seed for the 5 new grid tools + 14 SEO
  // landing variants — components/routes arrive in later W1 tasks, all on
  // the five-zone ToolShell (the shell owns the h1).
  "crop-image",
  "watermark-image",
  "compress-image-to-20kb",
  "compress-image-to-50kb",
  "compress-image-to-100kb",
  "compress-image-to-200kb",
  "compress-image-to-500kb",
  "compress-image-to-1mb",
  "compress-jpeg-to-50kb",
  "compress-jpeg-to-100kb",
  "compress-jpeg-to-200kb",
  "compress-signature-20kb",
  "heic-to-jpg",
  "heic-to-png",
  "mic-test",
  "webcam-test",
  "keyboard-tester",
  "gamepad-tester",
  // Wave 2 (W2) Task 9: registry seed for 9 SEO landing variants of PDF
  // Tools — components/routes arrive in later W2 tasks, all on the
  // five-zone ToolShell (the shell owns the h1).
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "rotate-pdf",
  "watermark-pdf",
  "sign-pdf",
  "extract-text-from-pdf",
  "reorder-pdf-pages",
  "jpg-to-pdf",
  // Wave 4 (W4) Task 8: Bingo Card Generator ships directly on ToolShell.
  "bingo-card-generator",
  // Wave 4 (W4) Task 9: Wheel of Names and Group Maker ship directly on ToolShell.
  "wheel-of-names",
  "group-maker",
  // Wave 4 (W4) Task 9: Classroom Timer is a Timer countdown preset, already
  // on ToolShell (the shell owns the h1).
  "classroom-timer",
  // Wave 4 (W4) Task 10: Word Unscrambler ships directly on ToolShell.
  "word-unscrambler",
  // Wave 4 (W4) Task 11: Wordle Solver ships directly on ToolShell.
  "wordle-solver",
  // Wave 4 (W4) Task 12: Anagram Solver ships directly on ToolShell.
  "anagram-solver",
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
