# Search Traffic Plan — BrowseryTools (2026-10-25)

Spec: `/Users/aghyad/dev/Aghyad-Vault/Claude/Plans/2026-10-25-browserytools-monetization-strategy.md`, section "Reality check — Google Search Console export" and "Traffic plan (SEO)". That section is the binding authority; this plan is its argument.

## Why

Google Search Console (last 3 months, 2026-07-24 → 2026-10-24): 3,248 clicks, 185k impressions, average position ~19. The site ranks on page 1 for only a handful of queries and converts impressions badly where it does. Five evidence-backed levers, ordered by expected clicks:

1. "ascii art generator" (6k impr, pos 9.9) and "depth map generator" (1.9k impr, pos 9.9) — push from page-1-bottom to top 5.
2. The on-device AI image cluster (depth-map, object-cutout, image-captioner, image-upscaler, bg-removal) is what Google already trusts; interlink it and give it bespoke prose.
3. Localized tool pages in ru/fa/ko/vi/tr earn clicks (ru compress-image-to-1mb 87 clicks; fa webcam-test 188) while the English commercial pages do not — but localized pages render only *templated* SEO prose today.
4. The top English tool pages by impressions mostly have no bespoke content and generic titles; unit-converter alone has 41,230 impressions at position 8.6 and 5 clicks (0.01% CTR).
5. Search appearance "Product snippets" shows 2,727 impressions at position 65 with 2 clicks — the homepage JSON-LD ItemList emits an `Offer` per tool.

## Global Constraints

Binding for every task. The reviewer checks each one.

- **Worktree:** all work happens in `/Users/aghyad/dev/browserytools/.worktrees/seo-traffic` on branch `seo/search-traffic-plan`. Use `git -C /Users/aghyad/dev/browserytools/.worktrees/seo-traffic …` for every git command, and absolute paths for every file. The shell cwd resets between commands.
- **Honesty rules of `src/lib/tool-content.ts` (header comment) apply verbatim:** prose is hand-authored and factual; `whyClientSide` must be tool-specific or omitted; `limitations` are honest and only included when the real limitations are known from reading the component source; FAQ answers must be true of the actual component. Never invent features, numbers, model names or file limits — read the component in `src/components/` before writing about it.
- **Every bespoke `toolContent` entry has both `en` and `ar`.** Arabic must read as native copy, not a literal translation (the repo's existing `ar` entries are the quality bar). Non-Latin scripts: no uppercase/letter-spacing/mono CSS assumptions — this is prose in data, so just write correct text.
- **Related slugs must exist in `tools-config.ts`** and be `available: true`. Prefer 3–5 related slugs; include cross-links the task names.
- **Do not add array-valued fields to tool entries in `src/lib/tools-config.ts`** — `scripts/validate-tools.js` parses that file with a regex that silently truncates on arrays. String fields are fine. Prefer new side modules keyed by slug.
- **Titles:** page `<title>` values are set by `src/lib/metadata.ts` (English routes) as `${tool.name} - Free Browser Tool`; the root layout appends the site-name suffix. Any override must keep the full title (override + suffix) at or under ~60 characters where possible and never stuff keywords; one primary query phrase, natural English.
- **JSON-LD honesty:** no ratings, reviews, or claims not backed by the page. FAQPage JSON-LD is only emitted for bespoke entries (existing gate in `ToolSeoContent.tsx`); keep that.
- **Quality gates before every commit:** `bun run validate && bun run lint && bunx tsc --noEmit && bun run test` all green from the worktree root. Test output must be pristine. If a pre-existing failure is found, report it; do not "fix" unrelated tests.
- **Commits:** one or more focused commits per task, conventional-commit style (`feat(seo): …`, `fix(seo): …`, `content(seo): …`). **No AI attribution footers, no "Co-Authored-By", no session links** in commit messages (repo owner rule).
- **No new dependencies.**
- **No changes to tool components' behaviour** (`src/components/<Tool>.tsx`) — this plan is content, metadata and structured data only. Reading components is required; editing them is out of scope.

## Task 5 — Stop emitting an Offer per tool from the homepage ItemList

**Goal:** remove the per-tool `offers` block from the homepage `ItemList` JSON-LD so the site stops surfacing as "Product snippets".

**Files:** `src/components/StructuredData.tsx` (and its test if one exists under `src/__tests__/`).

**Change:**
- In `getWebsiteStructuredData()` → `mainEntity.itemListElement[].item`, delete the `offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }` block. Keep `@type: SoftwareApplication`, `name`, `description`, `url`, `applicationCategory`, `operatingSystem`.
- Add `isAccessibleForFree: true` to each ItemList item (a boolean schema.org property that states the same fact without an Offer).
- Leave `getToolStructuredData()` (the per-tool page graph) unchanged.
- Add or extend a unit test that renders/calls the website structured data and asserts: no item has an `offers` key; every item has `isAccessibleForFree === true`; `numberOfItems` equals the item count.

**Acceptance:** test passes; `grep -n "offers" src/components/StructuredData.tsx` shows only the per-tool graph occurrence.

## Task 1 — Bespoke content and titles for `ascii-art` and `depth-map`

**Goal:** both pages currently use the templated fallback. Give each a hand-authored `toolContent` entry (en + ar) and a query-matched title/description, so they move from position ~10 into the top 5 for their head terms.

**Query evidence (use these phrases naturally, once each, never stuffed):**
- ascii-art: "ascii art generator" (5,999 impr, pos 9.9), "ascii generator" (483), "ascii art maker" (386), "ascii art generator from image" (97), "png to ascii" (62), "ascii art creator" (72).
- depth-map: "depth map generator" (1,874, pos 9.9), "depth map generator free" (1,045, pos 7.6), "image depth map generator" (535), "ai depth map generator free" (230), "depth map maker" (76), "grayscale depth map generator" (65).

**Part A — new side module `src/lib/seo-overrides.ts`:**
```ts
// Per-slug overrides for the English <title> and meta description built by
// src/lib/metadata.ts. Only for pages where Search Console shows the templated
// "<Name> - Free Browser Tool" title is under-performing on a known query.
// Keys are tool slugs (segment after /tools/). Absent slug = templated default.
export interface SeoOverride {
  /** Replaces `${tool.name} - Free Browser Tool`. Site suffix is still appended by the root layout. */
  title?: string;
  /** Replaces the templated description. ≤ 155 characters. */
  description?: string;
}
export const seoOverrides: Record<string, SeoOverride> = { … };
export function getSeoOverride(slug: string): SeoOverride | undefined
```
- Wire it into `generateToolMetadata()` in `src/lib/metadata.ts`: if an override exists for the slug derived from `href`, use `override.title ?? seoTitle` and `override.description ?? seoDescription` for `title`, `description`, `openGraph.title/description` and `twitter.title/description`. English routes only; `src/lib/locale-metadata.ts` is untouched (localized titles come from `messages/<locale>.json`).
- Unit test `src/__tests__/lib/seo-overrides.test.ts`: (a) `generateToolMetadata("/tools/ascii-art").title` equals the override; (b) a slug with no override still yields `${name} - Free Browser Tool`; (c) every override description is ≤ 155 chars and every override title is ≤ 60 chars.

**Part B — overrides for the two slugs:**
- `ascii-art`: title `ASCII Art Generator – Image or Text to ASCII` ; description along the lines of "Turn any photo or PNG into ASCII art, or type text to render in ASCII fonts. Adjust width, charset and contrast, then copy or download. Runs in your browser, nothing uploaded." — verify against `src/components/AsciiArt.tsx` which of those options actually exist and only claim the real ones.
- `depth-map`: title `Free AI Depth Map Generator – Image to Depth Map` ; description describing the real behaviour of `src/components/DepthMap.tsx` (model used, grayscale output, download format). Only claim what the component does.

**Part C — `toolContent` entries** in `src/lib/tool-content.ts` for `"ascii-art"` and `"depth-map"`, each with `en` and `ar`: `intro` (2–3 paragraphs, must say what the page does in the first sentence and include the head query once), `whyClientSide` (tool-specific: for depth-map the model download size/first-run wait is the honest trade-off, for ascii-art the privacy stake is small — say so), `limitations` (only real ones from the component source), `faq` (4–6; for depth-map cover: what a depth map is, which model runs, grayscale vs colour, can it be used for 3D/parallax/Blender displacement, why first run is slow, file formats; for ascii-art cover: image vs text mode, why output looks wrong in proportional fonts, how to pick width, colour output if supported, copy vs download), `steps` (3–5), `related` (depth-map: `object-cutout`, `image-upscaler`, `bg-removal`, `image-captioner`, `ascii-art`; ascii-art: `depth-map`, `meme-generator`, `screenshot-beautifier`, `code-screenshot`, `image-converter` — drop any that does not exist in tools-config).

**Acceptance:** both slugs appear in `toolContent`; `bun run test` green including the new test; visiting `/tools/ascii-art` and `/tools/depth-map` in `bun run dev` shows the bespoke About/FAQ block (implementer: confirm by curl of the SSR HTML containing the first intro sentence; a `grep` on the rendered HTML is enough).

## Task 2 — Interlink the on-device AI image cluster

**Goal:** make depth-map, object-cutout, image-captioner, image-upscaler and bg-removal link to each other with bespoke prose, and add them to the `image-tools` collection so the hub page links them too.

**Part A — `toolContent` entries (en + ar)** for `object-cutout`, `image-captioner`, `image-upscaler` (read each component before writing; `bg-removal` — check whether a bespoke entry already exists; if it does, only update its `related`; if not, add one). Each `related` list must include at least two of the other four cluster slugs plus `depth-map`. Same quality bar as Task 1.

**Part B — `src/lib/tool-clusters.ts`:** add `bg-removal`, `object-cutout`, `image-upscaler`, `image-captioner`, `depth-map` to the `image-tools` cluster `slugs` (after `image-compression`/`image-converter`/`image-resizer`, before the design-ish tools). Keep them in `on-device-ai`. Run `src/__tests__/lib/tool-clusters.test.ts`; if it asserts clusters are disjoint, report BLOCKED with the assertion text rather than weakening the test.

**Part C — blog post `src/app/blog/posts/object-cutout-guide.tsx`** (ranks pos 27 for 4,060 impressions): add a final `<h2>Related on-device image tools</h2>` section with one sentence + link each for `/tools/depth-map`, `/tools/bg-removal`, `/tools/image-upscaler`, `/tools/image-captioner`, matching the post's existing link style. Do the same in the Arabic twin `object-cutout-guide-ar` post file (find it via `src/lib/blog-data.ts` slug `object-cutout-guide-ar`). Do not change titles or metadata of the posts.

**Acceptance:** cluster test green; `/collections/image-tools` renders the five AI tools; both blog posts show the new section.

## Task 3 — Localized SEO prose for ru and fa (infrastructure + content)

**Goal:** localized tool pages currently render only templated prose. Allow bespoke per-locale prose, then write it for the compress/HEIC/PDF landers in Russian and Persian.

**Part A — type and renderer:**
- In `src/lib/tool-content.ts`, change `ToolContent` so that locales beyond `en`/`ar` are optional:
  ```ts
  export type ExtraContentLocale = Exclude<Locale, "en" | "ar">;
  export interface ToolContent {
    en: ToolContentLocale;
    ar: ToolContentLocale;
    related: string[];
    /** Optional hand-authored prose for other registry locales. */
    extra?: Partial<Record<ExtraContentLocale, ToolContentLocale>>;
  }
  ```
  (If `Locale` is not a string-literal union usable in `Exclude`, use `Partial<Record<string, ToolContentLocale>>` and document it.)
- In `src/components/ToolSeoContent.tsx`, where the locale's content is chosen: if `toolContent[slug]?.extra?.[seoLocale]` exists, use it and treat the page as bespoke (so FAQPage/HowTo JSON-LD are emitted); otherwise keep the existing behaviour (en/ar bespoke, templated fallback elsewhere). Do not change the suppression rule for locales with no fallback prose.
- Unit test `src/__tests__/lib/tool-content-extra.test.ts`: every `extra` locale key is a registered locale; every `extra` entry has a non-empty `intro` and ≥ 3 `faq` items; no `extra` entry has `limitations` longer than 4 items.

**Part B — content.** For each of these 7 slugs: `image-compression`, `compress-image-to-1mb`, `compress-image-to-500kb`, `compress-image-to-100kb`, `heic-to-jpg`, `heic-to-png`, `compress-pdf` — add `extra.ru` and `extra.fa` with `intro` (2 paragraphs), `faq` (3–4), `steps` (3–4). `whyClientSide` and `limitations` only when you can state them truthfully from the English entry (translate the meaning, do not invent). Russian must use the natural search phrasing ("сжать фото до 1 МБ", "сжать изображение", "HEIC в JPG"); Persian likewise ("فشرده سازی عکس", "تبدیل HEIC به JPG"). The existing `en` entry for each slug (if present) is the source of truth for facts; if a slug has no `en` entry, derive facts from the component and tools-config description only.

**Acceptance:** `/ru/tools/compress-image-to-1mb` SSR HTML contains the Russian intro's first sentence; FAQPage JSON-LD present on that page; test green.

## Task 4 — Localized SEO prose for ko, vi and tr (content only)

**Depends on Task 3's `extra` field.** Same 7 slugs, add `extra.ko`, `extra.vi`, `extra.tr` with the same structure and rules as Task 3 Part B. Use natural local search phrasing (ko: "이미지 압축 1MB", "HEIC JPG 변환"; vi: "nén ảnh xuống 1MB", "chuyển HEIC sang JPG"; tr: "fotoğrafı 1 MB'a küçült", "HEIC'i JPG'ye dönüştür"). Also add `extra.ko` for `aspect-ratio` and `exif-viewer`, `extra.vi` for `group-maker`, `extra.tr` for `random-picker` and `text-repeater`, `extra.fa` for `webcam-test`, `classroom-timer`, `text-repeater`, `mic-test` — these are the localized pages Search Console shows earning impressions already.

**Acceptance:** Task 3's test still green with the new entries; `/ko/tools/compress-image-to-500kb` SSR HTML contains the Korean intro.

## Task 6 — English on-page pass, batch A (titles for the top 30 + 6 bespoke entries)

**Goal:** the English pages with the most impressions have generic titles and templated prose.

**Part A — `seoOverrides` (from Task 1's module) for these 30 slugs** (impressions → position in parentheses; write a title that names the tool's job in the words searchers use, ≤ 60 chars including " | BrowseryTools" if that is the layout suffix — check `src/app/layout.tsx` title template first — and a ≤ 155-char description stating what the page does and that it runs in the browser with no upload):
`unit-converter` (41,230 → 8.6), `ascii-art` (done in Task 1), `depth-map` (done in Task 1), `reorder-pdf-pages` (6,084 → 62.7), `percentage-calculator` (4,115 → 17.2), `loan-calculator` (2,806 → 64.9), `model-comparison` (2,270 → 18), `keyboard-tester` (1,899 → 56.9), `token-counter` (1,894 → 9.4), `color-palette` (1,639 → 56), `group-maker` (1,504 → 47.3), `ai-cost-calculator` (1,368 → 60.2), `word-unscrambler` (1,133 → 22), `screen-recorder` (1,096 → 56.2), `meme-generator` (1,031 → 48.7), `clip-path-generator` (1,024 → 10.1), `calculator` (966 → 19.2), `rotate-pdf` (820 → 49.6), `text-encryption` (782 → 14.2), `morse-code` (722 → 13.8), `timer` (706 → 10.8), `anagram-solver` (659 → 19.5), `wordle-solver` (612 → 30.3), `image-converter` (604 → 47.2), `image-captioner` (575 → 18.4), `context-window` (521 → 5.4), `image-resizer` (462 → 57.3), `crop-image` (437 → 59.9), `favicon-generator` (408 → 55.7), `compress-signature-20kb` (380 → 9).
For `unit-converter` specifically: Google shows its own converter widget for generic queries, so the title must name concrete conversions people type ("Unit Converter – Length, Weight, Temperature, Area & More") and the description must list 5–6 real unit groups taken from the component.

**Part B — bespoke `toolContent` entries (en + ar)** for: `unit-converter`, `percentage-calculator`, `loan-calculator`, `model-comparison`, `color-palette`, `ai-cost-calculator`. Read each component first. `related` ≥ 3 existing slugs.

**Acceptance:** Task 1's override test (title ≤ 60 / description ≤ 155) passes for all 30; six new entries present; gates green.

## Task 7 — English on-page pass, batch B (8 bespoke entries)

Bespoke `toolContent` (en + ar) for: `screen-recorder`, `meme-generator`, `clip-path-generator`, `text-encryption`, `morse-code`, `timer`, `context-window`, `favicon-generator`. Same rules as Task 6 Part B.

## Task 8 — English on-page pass, batch C (8 bespoke entries)

Bespoke `toolContent` (en + ar) for: `word-frequency`, `text-diff`, `text-summarizer`, `video-to-audio`, `screenshot-beautifier`, `css-gradient`, `speech-to-text`, `barcode-generator`. Same rules as Task 6 Part B. (`speech-to-text` uses the browser Web Speech API which sends audio to the browser vendor in Chrome/Edge — the README states this; the `whyClientSide` must say so honestly rather than claim on-device processing.)
