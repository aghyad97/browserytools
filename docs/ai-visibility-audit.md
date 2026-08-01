# AI Discoverability Audit — browserytools.com

Scope: audit only, no application code changed. Every number below comes from a file actually read in this repo or a live HTTP request actually made against `https://browserytools.com` on 2026-07-31. Anything I could not verify is marked `TODO(verify)`.

**Bottom line up front — the three things that matter most:**

1. **`/tools/calculator` canonicalizes to the homepage, not to itself.** Its `metadata` export is a hand-written object that skips `generateToolMetadata`, so Next.js falls back to the root layout's `alternates.canonical: "/"`. Live HTML confirms `<link rel="canonical" href="https://browserytools.com"/>` on the calculator page — this actively tells crawlers the canonical version of that content lives elsewhere.
2. **All ~537 blog posts emit zero valid JSON-LD.** The `BlogPosting` structured data is written into `metadata.other["application/ld+json"]`, which Next.js renders as `<meta name="application/ld+json" content="...">` — not a `<script type="application/ld+json">` block. Confirmed live: 0 `<script type="application/ld+json">` tags on a fetched blog post, versus a broken, HTML-entity-escaped `<meta>` tag holding the payload.
3. **hreflang is self-referential and therefore ignorable.** Every tool page emits 10 `<link rel="alternate" hreflang="...">` tags (x-default + 9 locales) that all point at the exact same URL. Confirmed live on `/tools/json-formatter`. This is the classic pattern search engines discard entirely — no locale signal is actually being sent, ar/es/fr/etc. content has no URL to point to in the first place.

---

## 1. Crawler access

`src/app/robots.ts` defines an explicit `aiCrawlers` array (17 entries) plus `*`, `Googlebot`, `Bingbot` rules, all with `allow: "/"` and the same `disallow` list (`/api/`, `/_next/`, `/admin/`, `/private/`, `/coffee`, `/gh`, `/x`). Verified live at `https://browserytools.com/robots.txt` — byte-identical to what `robots.ts` generates. Confirmed via `curl -I` on a tool page: **no `X-Robots-Tag` response header** anywhere, and no `middleware.ts` exists in the repo (`find` for `middleware*` returns nothing) — so there is no header-level blocking layered on top of `robots.txt`. `next.config.ts` only sets `Cache-Control`/`COOP` headers, nothing robots-related.

robots.txt user-agent tokens match case-insensitively, so `Meta-ExternalAgent` (as written in `robots.ts`) covers `meta-externalagent` regardless of case.

| Crawler | Status | Where configured |
|---|---|---|
| GPTBot | Explicitly allowed | `robots.ts` `aiCrawlers` array |
| ClaudeBot | Explicitly allowed | `robots.ts` `aiCrawlers` array |
| Claude-User | **Absent** from the explicit list — allowed via the `userAgent: "*"` wildcard rule only | Not in `aiCrawlers`; only `ClaudeBot`, `Claude-Web`, `anthropic-ai` are listed |
| Claude-SearchBot | **Absent** — allowed via wildcard only | Same as above |
| Google-Extended | Explicitly allowed | `robots.ts` `aiCrawlers` array |
| PerplexityBot | Explicitly allowed | `robots.ts` `aiCrawlers` array |
| CCBot | Explicitly allowed | `robots.ts` `aiCrawlers` array |
| Bingbot | Explicitly allowed | Dedicated rule in `robots.ts` (separate from `aiCrawlers`) |
| Applebot-Extended | Explicitly allowed | `robots.ts` `aiCrawlers` array |
| meta-externalagent | Explicitly allowed (case-insensitive match on `Meta-ExternalAgent`) | `robots.ts` `aiCrawlers` array |

Also present but not requested by name: `OAI-SearchBot`, `ChatGPT-User`, `Claude-Web`, `anthropic-ai`, `Perplexity-User`, `cohere-ai`, `Bytespider`, `DuckAssistBot`, `Amazonbot`, `YouBot`.

Net effect: nothing is blocked for any crawler on any public route — the wildcard rule alone would already allow every AI bot; the explicit list is a documentation/clarity layer, not a gate. `Claude-User` and `Claude-SearchBot` (Anthropic's newer 2025-era tokens) simply aren't named yet, though they are unaffected in practice since the wildcard covers them identically.

---

## 2. Rendering mode per tool route — measured, not inferred

Method: enumerated all 176 tools from `src/lib/tools-config.ts` via `getAllTools()` (script: `/private/tmp/claude-501/-Users-aghyad-dev-browserytools/ed3dfd8b-7715-463b-bf2f-16ccc97b2caa/scratchpad/dump-tools.ts`), then fetched every corresponding production URL with `curl -A "ClaudeBot/1.0 (+https://www.anthropic.com/claudebot)"`, 4 concurrent workers with a 200ms stagger, single pass, no retries. Script: `/private/tmp/claude-501/-Users-aghyad-dev-browserytools/ed3dfd8b-7715-463b-bf2f-16ccc97b2caa/scratchpad/measure_rendering.py`. `<script>`/`<style>` blocks were stripped before tag-stripping and whitespace-collapsing for the word count.

**Result: 175/176 routes return 200 with fully server-rendered, substantial content. 1/176 (`totp-generator`) returns 404 in production.**

- Word count range across the 175 live pages: **177–1572 words**, median 261, mean ~293.
- **175/175 (100%)** live pages contain the `data-testid="tool-seo-content"` About section.
- **175/175 (100%)** live pages contain `FAQPage`, `BreadcrumbList`, and `SoftwareApplication` JSON-LD.
- **46/176** tools in the current codebase include a `HowTo` JSON-LD graph (i.e. have a `steps` array in `src/lib/tool-content.ts`) — this is a subset of the 50 hand-authored tools; none of the 126 templated-fallback tools have steps (confirmed: every fallback tool's `stepsCount` is 0).

**The one 404 — `/tools/totp-generator`:** the route exists locally (`src/app/tools/totp-generator/page.tsx`, committed in `b1a782e`, already on `main`), but production 404s on it, and both the **live** `sitemap.xml` and **live** `llms.txt` contain zero references to `totp-generator` (`grep -c "totp-generator"` on both returns 0). This is a production deployment lag (the tool merged the day before this audit), not a routing or content defect — it should self-resolve on the next deploy. Flagging only because it currently means the newest tool is fully invisible to crawlers and is the sole page under the "100 words" thin-content threshold in the whole measurement (its 404 page is 22 words).

Full per-route table (slug, live HTTP status, visible word count, About section present, FAQPage JSON-LD present):

| Slug | Status | Words | About section | FAQPage JSON-LD |
|---|---|---|---|---|
| `image-upscaler` | 200 | 277 | Yes | Yes |
| `image-captioner` | 200 | 262 | Yes | Yes |
| `depth-map` | 200 | 270 | Yes | Yes |
| `object-cutout` | 200 | 266 | Yes | Yes |
| `ascii-art` | 200 | 262 | Yes | Yes |
| `photo-collage` | 200 | 266 | Yes | Yes |
| `exif-remover` | 200 | 261 | Yes | Yes |
| `screenshot-beautifier` | 200 | 255 | Yes | Yes |
| `meme-generator` | 200 | 240 | Yes | Yes |
| `bg-removal` | 200 | 252 | Yes | Yes |
| `phone-mockups` | 200 | 272 | Yes | Yes |
| `image-compression` | 200 | 229 | Yes | Yes |
| `image-converter` | 200 | 266 | Yes | Yes |
| `color-correction` | 200 | 223 | Yes | Yes |
| `svg` | 200 | 203 | Yes | Yes |
| `svg-png` | 200 | 277 | Yes | Yes |
| `photo-censor` | 200 | 254 | Yes | Yes |
| `image-resizer` | 200 | 252 | Yes | Yes |
| `exif-viewer` | 200 | 209 | Yes | Yes |
| `favicon-generator` | 200 | 288 | Yes | Yes |
| `crop-image` | 200 | 334 | Yes | Yes |
| `watermark-image` | 200 | 347 | Yes | Yes |
| `compress-image-to-20kb` | 200 | 466 | Yes | Yes |
| `compress-image-to-50kb` | 200 | 430 | Yes | Yes |
| `compress-image-to-100kb` | 200 | 394 | Yes | Yes |
| `compress-image-to-200kb` | 200 | 394 | Yes | Yes |
| `compress-image-to-500kb` | 200 | 390 | Yes | Yes |
| `compress-image-to-1mb` | 200 | 392 | Yes | Yes |
| `compress-jpeg-to-50kb` | 200 | 410 | Yes | Yes |
| `compress-jpeg-to-100kb` | 200 | 402 | Yes | Yes |
| `compress-jpeg-to-200kb` | 200 | 407 | Yes | Yes |
| `compress-signature-20kb` | 200 | 408 | Yes | Yes |
| `heic-to-jpg` | 200 | 363 | Yes | Yes |
| `heic-to-png` | 200 | 368 | Yes | Yes |
| `pdf` | 200 | 347 | Yes | Yes |
| `merge-pdf` | 200 | 373 | Yes | Yes |
| `split-pdf` | 200 | 370 | Yes | Yes |
| `compress-pdf` | 200 | 384 | Yes | Yes |
| `rotate-pdf` | 200 | 352 | Yes | Yes |
| `watermark-pdf` | 200 | 368 | Yes | Yes |
| `sign-pdf` | 200 | 383 | Yes | Yes |
| `extract-text-from-pdf` | 200 | 382 | Yes | Yes |
| `reorder-pdf-pages` | 200 | 346 | Yes | Yes |
| `jpg-to-pdf` | 200 | 374 | Yes | Yes |
| `zip` | 200 | 214 | Yes | Yes |
| `spreadsheet` | 200 | 221 | Yes | Yes |
| `file-converter` | 200 | 250 | Yes | Yes |
| `pdf-to-word` | 200 | 484 | Yes | Yes |
| `word-to-pdf` | 200 | 398 | Yes | Yes |
| `video` | 200 | 208 | Yes | Yes |
| `audio` | 200 | 207 | Yes | Yes |
| `mic-camera` | 200 | 215 | Yes | Yes |
| `compress-video` | 200 | 331 | Yes | Yes |
| `screen-recorder` | 200 | 248 | Yes | Yes |
| `gif-maker` | 200 | 260 | Yes | Yes |
| `subtitle-studio` | 200 | 369 | Yes | Yes |
| `video-to-audio` | 200 | 262 | Yes | Yes |
| `mic-test` | 200 | 352 | Yes | Yes |
| `webcam-test` | 200 | 345 | Yes | Yes |
| `speech-to-text` | 200 | 282 | Yes | Yes |
| `image-to-text` | 200 | 315 | Yes | Yes |
| `text-to-speech` | 200 | 287 | Yes | Yes |
| `text-case` | 200 | 258 | Yes | Yes |
| `text-counter` | 200 | 457 | Yes | Yes |
| `rich-editor` | 200 | 221 | Yes | Yes |
| `lorem-ipsum` | 200 | 335 | Yes | Yes |
| `text-diff` | 200 | 196 | Yes | Yes |
| `markdown-editor` | 200 | 500 | Yes | Yes |
| `notepad` | 200 | 208 | Yes | Yes |
| `text-sorter` | 200 | 263 | Yes | Yes |
| `word-frequency` | 200 | 245 | Yes | Yes |
| `markdown-html` | 200 | 241 | Yes | Yes |
| `text-repeater` | 200 | 245 | Yes | Yes |
| `markdown-table` | 200 | 244 | Yes | Yes |
| `word-unscrambler` | 200 | 352 | Yes | Yes |
| `wordle-solver` | 200 | 377 | Yes | Yes |
| `anagram-solver` | 200 | 349 | Yes | Yes |
| `json-csv` | 200 | 207 | Yes | Yes |
| `base64` | 200 | 247 | Yes | Yes |
| `qr-generator` | 200 | 354 | Yes | Yes |
| `barcode-generator` | 200 | 393 | Yes | Yes |
| `qr-scanner` | 200 | 284 | Yes | Yes |
| `barcode-scanner` | 200 | 288 | Yes | Yes |
| `charts` | 200 | 340 | Yes | Yes |
| `yaml-json` | 200 | 212 | Yes | Yes |
| `url-encoder` | 200 | 211 | Yes | Yes |
| `fake-data` | 200 | 243 | Yes | Yes |
| `text-binary` | 200 | 222 | Yes | Yes |
| `json-to-ts` | 200 | 204 | Yes | Yes |
| `mermaid` | 200 | 222 | Yes | Yes |
| `morse-code` | 200 | 246 | Yes | Yes |
| `unit-converter` | 200 | 292 | Yes | Yes |
| `timezone-converter` | 200 | 279 | Yes | Yes |
| `calculator` | 200 | 260 | Yes | Yes |
| `age-calculator` | 200 | 225 | Yes | Yes |
| `number-base-converter` | 200 | 198 | Yes | Yes |
| `currency-converter` | 200 | 257 | Yes | Yes |
| `loan-calculator` | 200 | 237 | Yes | Yes |
| `percentage-calculator` | 200 | 247 | Yes | Yes |
| `aspect-ratio` | 200 | 256 | Yes | Yes |
| `bmi-calculator` | 200 | 217 | Yes | Yes |
| `tip-calculator` | 200 | 224 | Yes | Yes |
| `roman-numeral` | 200 | 268 | Yes | Yes |
| `mind-map` | 200 | 177 | Yes | Yes |
| `signature-maker` | 200 | 249 | Yes | Yes |
| `random-picker` | 200 | 243 | Yes | Yes |
| `todo` | 200 | 228 | Yes | Yes |
| `timer` | 200 | 282 | Yes | Yes |
| `pomodoro` | 200 | 243 | Yes | Yes |
| `world-clock` | 200 | 217 | Yes | Yes |
| `stopwatch` | 200 | 199 | Yes | Yes |
| `habit-tracker` | 200 | 221 | Yes | Yes |
| `keep-awake` | 200 | 304 | Yes | Yes |
| `uuid-generator` | 200 | 317 | Yes | Yes |
| `unix-timestamp` | 200 | 199 | Yes | Yes |
| `regex-tester` | 200 | 210 | Yes | Yes |
| `cron-parser` | 200 | 193 | Yes | Yes |
| `http-status` | 200 | 1572 | Yes | Yes |
| `css-minifier` | 200 | 212 | Yes | Yes |
| `sql-formatter` | 200 | 210 | Yes | Yes |
| `chmod` | 200 | 247 | Yes | Yes |
| `meta-tags` | 200 | 320 | Yes | Yes |
| `curl-converter` | 200 | 213 | Yes | Yes |
| `code-format` | 200 | 296 | Yes | Yes |
| `html-formatter` | 200 | 207 | Yes | Yes |
| `json-formatter` | 200 | 281 | Yes | Yes |
| `jwt-decoder` | 200 | 299 | Yes | Yes |
| `password-generator` | 200 | 338 | Yes | Yes |
| `hash-generator` | 200 | 309 | Yes | Yes |
| `password-strength` | 200 | 247 | Yes | Yes |
| `text-encryption` | 200 | 267 | Yes | Yes |
| `totp-generator` | **404** | 22 | No | No |
| `clip-path-generator` | 200 | 281 | Yes | Yes |
| `cubic-bezier` | 200 | 258 | Yes | Yes |
| `glassmorphism-generator` | 200 | 294 | Yes | Yes |
| `svg-blob-generator` | 200 | 268 | Yes | Yes |
| `code-screenshot` | 200 | 253 | Yes | Yes |
| `og-image-generator` | 200 | 289 | Yes | Yes |
| `css-gradient` | 200 | 280 | Yes | Yes |
| `color-palette` | 200 | 248 | Yes | Yes |
| `color-converter` | 200 | 261 | Yes | Yes |
| `contrast-checker` | 200 | 297 | Yes | Yes |
| `emoji-picker` | 200 | 329 | Yes | Yes |
| `css-shadow` | 200 | 242 | Yes | Yes |
| `image-color-picker` | 200 | 243 | Yes | Yes |
| `color-blindness` | 200 | 215 | Yes | Yes |
| `audio-transcriber` | 200 | 257 | Yes | Yes |
| `text-summarizer` | 200 | 250 | Yes | Yes |
| `translator` | 200 | 247 | Yes | Yes |
| `pii-redactor` | 200 | 270 | Yes | Yes |
| `zero-shot-classifier` | 200 | 264 | Yes | Yes |
| `sentiment-analyzer` | 200 | 228 | Yes | Yes |
| `token-counter` | 200 | 220 | Yes | Yes |
| `context-window` | 200 | 242 | Yes | Yes |
| `ai-cost-calculator` | 200 | 250 | Yes | Yes |
| `model-comparison` | 200 | 629 | Yes | Yes |
| `system-prompt-builder` | 200 | 248 | Yes | Yes |
| `prompt-library` | 200 | 222 | Yes | Yes |
| `claude-md-generator` | 200 | 229 | Yes | Yes |
| `ai-rules-generator` | 200 | 244 | Yes | Yes |
| `json-schema-builder` | 200 | 250 | Yes | Yes |
| `mcp-config` | 200 | 231 | Yes | Yes |
| `prompt-formatter` | 200 | 223 | Yes | Yes |
| `skill-builder` | 200 | 237 | Yes | Yes |
| `ai-instruction-diff` | 200 | 231 | Yes | Yes |
| `text-similarity` | 200 | 219 | Yes | Yes |
| `typing-test` | 200 | 200 | Yes | Yes |
| `keyboard-tester` | 200 | 489 | Yes | Yes |
| `gamepad-tester` | 200 | 353 | Yes | Yes |
| `periodic-table` | 200 | 488 | Yes | Yes |
| `wheel-of-names` | 200 | 432 | Yes | Yes |
| `group-maker` | 200 | 420 | Yes | Yes |
| `bingo-card-generator` | 200 | 444 | Yes | Yes |
| `classroom-timer` | 200 | 446 | Yes | Yes |
| `invoice` | 200 | 215 | Yes | Yes |
| `expense-tracker` | 200 | 187 | Yes | Yes |

---

## 3. Metadata

**The one route lacking `generateToolMetadata`: `/tools/calculator`.** `src/app/tools/calculator/page.tsx` exports a hand-written static `metadata` object instead of calling `generateToolMetadata("/tools/calculator")` like the other 175 tool pages. Consequences, confirmed on the live page:

- **Canonical points at the homepage**, not the tool: `<link rel="canonical" href="https://browserytools.com"/>`. Root cause: the page's `metadata` has no `alternates` key at all, so Next.js's metadata resolution falls back to the parent `src/app/layout.tsx`'s `alternates: { canonical: "/" }`.
- **hreflang cluster also points at the homepage** — all 10 `<link rel="alternate" hreflang="...">` tags resolve to `https://browserytools.com`, inherited from the same root layout default.
- **Doubled title tag**: live `<title>` is `Calculator - Basic & Scientific | BrowseryTools | BrowseryTools — أدواتك`. The page's own title string ("...| BrowseryTools") is treated as a template substitution (`%s`) by the root layout's `title.template: "%s | BrowseryTools — أدواتك"`, so the brand suffix gets appended twice.

**Title-length distribution** (computed for all 176 tools from the live template in `generateToolMetadata`: `` `${tool.name} - 100% Free ${tool.category} Tool | No Ads, No Registration, No Servers` ``):

| Bucket | Count |
|---|---|
| ≤60 chars | 0 |
| 61–70 | 0 |
| 71–80 | 43 |
| 81–90 | 103 |
| 91–100 | 27 |
| >100 | 3 |

**176/176 (100%) of tool titles exceed 60 characters** — min 72, max 101, mean 85.1. Google typically truncates displayed titles around ~55–60 characters (device/font dependent), so every single tool title on the site is truncation-prone in a SERP or an AI citation snippet. Shortest: `Charts - 100% Free Data Tools Tool | No Ads, No Registration, No Servers` (72 chars). Longest: `Markdown Table Generator - 100% Free Text & Language Tools Tool | No Ads, No Registration, No Servers` (101 chars).

**Description boilerplate.** Every tool's meta description is `` `${tool.description} ${sharedTail}` `` where `sharedTail` is a fixed 175-character string: *"Completely free forever - no hidden fees, no ads, no registration required. Runs entirely in your browser with full privacy. Open source and updated weekly with new features."* Across all 176 tools, the average full description is 312.7 characters, meaning **on average 57.0% of every tool's meta description is byte-for-byte identical** to every other tool's. This is search-engine-visible duplicate content at the description-tag level for the entire catalog.

---

## 4. Sitemap

`src/app/sitemap.ts` emits, per the live `sitemap.xml` fetched with a ClaudeBot UA:

| Route class | Count |
|---|---|
| Static (`/`, `/blog`, `/privacy`, `/terms`) | 4 |
| Tool routes (`allTools.filter(available)`) | 175 (live) / 176 in the current codebase — the discrepancy is the `totp-generator` deploy lag from §2 |
| Blog routes | ~535–537 (live `<loc>` count for `/blog/`; `blogPosts.length` in code is 537) |
| **Total** | **714 `<loc>` entries live** |

**No locale coverage whatsoever** — 0 of the 714 URLs contain a locale segment (`/es/`, `/ar/`, etc.); confirmed by grepping the live sitemap XML. There is no `[locale]` route segment and no `middleware.ts` in the repo, so this isn't a sitemap oversight — there are simply no other-locale URLs to list. Every one of the 9 locales except `en` has zero independently indexable pages.

**hreflang and canonicals: broken by design, not a bug in the code that emits them.** `hreflangLanguages()` in `src/lib/locales.ts:115` is explicitly documented as "Option A: same URL per locale" and returns the identical `url` argument for `x-default` and all 9 locale codes. This is not a coding mistake — it's a deliberate acknowledgment of the one-URL-per-tool architecture — but the SEO consequence is real: a self-referential hreflang cluster (all N alternates pointing at the same URL) is the textbook case search engines are documented to discard entirely, because it carries no actual signal about where the Arabic/Spanish/French version of the page lives (there isn't one). Confirmed live on `/tools/json-formatter`: 10 `hreflang` links, one URL. Practically, this means the hreflang markup currently on every page of the site is inert — it costs bytes and adds no discoverability benefit, and in the worst case reads as a low-quality/spammy signal to a crawler that expects distinct URLs per hreflang entry.

---

## 5. Structured data

| Component | `@type`(s) emitted | Route(s) it fires on | Status |
|---|---|---|---|
| `src/components/ToolSeoContent.tsx` + `src/components/JsonLdScript.tsx` | `SoftwareApplication`, `BreadcrumbList`, `FAQPage` (if FAQ present), `HowTo` (if steps present) | All 176 tool routes, rendered once via `src/app/tools/layout.tsx` (a shared "use client" layout, but still SSR'd into the initial HTML — confirmed live) | Working correctly. Emitted as real `<script type="application/ld+json">` tags via `JsonLdScript`'s `React.createElement`. |
| `src/components/StructuredData.tsx` (`type="website"`) | `WebSite` + nested `Organization` + `ItemList` of `SoftwareApplication` | Homepage only (`src/app/(home)/page.tsx:88`) | Working correctly, valid `<script>` tag. |
| `src/components/StructuredData.tsx` (`type="tool"` / `type="organization"`) | `SoftwareApplication` / `Organization` | **Never invoked anywhere in the app** — grepped all of `src/app` and `src` for `<StructuredData` usage; only the `type="website"` call exists | Dead code. Not a bug, just unused surface area. |
| `src/app/blog/[slug]/page.tsx` (`generateMetadata`) | `BlogPosting` | All ~537 blog post routes | **Broken.** The JSON-LD object is passed via `metadata.other["application/ld+json"]`. Next.js's `other` metadata field renders every key as a `<meta name="{key}" content="{value}">` tag — confirmed live: the blog post HTML contains `<meta name="application/ld+json" content="{&quot;@context&quot;:...}">` and **zero** `<script type="application/ld+json">` tags. No crawler's JSON-LD parser will ever read this; it is not machine-readable structured data, just an oddly-named meta tag holding an HTML-entity-escaped JSON string. |

Two smaller, non-blocking structured-data quality notes:

- **`applicationCategory` values don't match Google's recognized enum.** `SoftwareApplication.applicationCategory` is set to the site's internal category strings ("Image Tools", "File Tools", "AI Tools", "Math & Finance Tools", etc.) rather than one of the schema.org/Google-recognized app-category tokens (`UtilitiesApplication`, `DeveloperApplication`, `MultimediaApplication`, etc.). Not invalid per the core vocabulary (the property accepts free text), but it means this field likely doesn't contribute to any category-based rich-result eligibility.
- **`BreadcrumbList`'s middle crumb doesn't point at a real page.** In `ToolSeoContent.tsx`'s `buildJsonLd`, position 2 (the category, e.g. "Image Tools") has `item: `${BASE_URL}/`` — the homepage URL, not a category-specific page (none exists). It's schema-syntactically valid but semantically the second breadcrumb "points" at the same place as the first.

---

## 6. Unique prose per tool

Two measurements, both from data already gathered:

- **§2's live full-page word counts**: floor is 177 words (`mind-map`) among the 175 live pages. **Zero live pages fall under 100 words.**
- **Unique-prose word counts** (the About + FAQ text only, i.e. what's actually unique per tool excluding shared nav/header/footer chrome) — computed directly from `src/lib/tool-content.ts` and `buildFallbackContent()` via a script that imports the real functions (`/private/tmp/claude-501/-Users-aghyad-dev-browserytools/ed3dfd8b-7715-463b-bf2f-16ccc97b2caa/scratchpad/dump-content-words.ts`): fallback-content tools range 125–159 words (mean 141.9), hand-authored tools range 151–413 words (mean 286.9). **Zero tools — fallback or authored — fall under 100 words on this metric either.**

So: **the "under 100 words" thin-content risk the premise worried about doesn't materialize as a raw word-count problem.** The real exposure is different and more serious: **near-identical templated content at scale.**

**The 126 slugs receiving `buildFallbackContent` instead of hand-authored content** (176 total tools − 50 slugs with a bespoke entry in `toolContent`, confirmed by diffing the two sets exactly):

```
age-calculator, ai-cost-calculator, ai-instruction-diff, ai-rules-generator, ascii-art,
aspect-ratio, audio, audio-transcriber, barcode-generator, barcode-scanner, bg-removal,
bmi-calculator, charts, chmod, claude-md-generator, clip-path-generator, code-format,
code-screenshot, color-blindness, color-correction, color-palette, context-window,
contrast-checker, cron-parser, css-gradient, css-minifier, css-shadow, cubic-bezier,
curl-converter, currency-converter, depth-map, emoji-picker, exif-remover, exif-viewer,
expense-tracker, fake-data, favicon-generator, file-converter, gif-maker,
glassmorphism-generator, habit-tracker, html-formatter, http-status, image-captioner,
image-color-picker, image-compression, image-to-text, image-upscaler, invoice, json-csv,
json-schema-builder, json-to-ts, jwt-decoder, keep-awake, loan-calculator, lorem-ipsum,
markdown-editor, markdown-html, markdown-table, mcp-config, meme-generator, mermaid,
meta-tags, mic-camera, mind-map, model-comparison, morse-code, notepad,
number-base-converter, object-cutout, og-image-generator, password-strength,
percentage-calculator, periodic-table, phone-mockups, photo-censor, photo-collage,
pii-redactor, pomodoro, prompt-formatter, prompt-library, qr-scanner, random-picker,
regex-tester, rich-editor, screen-recorder, screenshot-beautifier, sentiment-analyzer,
signature-maker, skill-builder, speech-to-text, spreadsheet, sql-formatter, stopwatch,
svg, svg-blob-generator, system-prompt-builder, text-binary, text-case, text-counter,
text-diff, text-encryption, text-repeater, text-similarity, text-sorter, text-summarizer,
text-to-speech, timer, timezone-converter, tip-calculator, todo, token-counter,
totp-generator, translator, typing-test, unit-converter, unix-timestamp, url-encoder,
uuid-generator, video, video-to-audio, word-frequency, world-clock, yaml-json,
zero-shot-classifier, zip
```

**126 of 176 tool pages (72%) run on the templated fallback path.** Quantifying the similarity across those 126 pages (computed by rendering each one's actual `buildFallbackContent()` output and diffing against the fixed template strings):

- Average total intro+FAQ content per fallback page: **798.7 characters**.
- Of that, **589.5 characters (73.8%) are byte-for-byte identical** across all 126 pages — only the tool's `name` and `category` are substituted into an otherwise fixed template, and 2 of the 3 FAQ question/answer pairs are 100% identical text on every single fallback page (only the first FAQ question's tool name changes).
- The only genuinely unique sentence is the tool's own one-line marketing description (avg 148.9 characters) — which is *also* the exact same string already used verbatim in that page's `<meta name="description">` tag (§3), so it isn't even unique within the page.
- Net: **81.4% of a fallback page's on-page SEO content is either identical boilerplate or a simple name/category substitution.** This is the real thin/duplicate-content exposure — 126 pages that are legitimately server-rendered and legitimately over the word-count floor, but whose actual informational content is templated at a ~74–81% duplication rate.

---

## 7. On-device AI model sizes

All ten tools load models via `src/lib/hf-pipeline.ts`'s shared `getPipeline()` (nine of them) or `src/lib/sam-segment.ts` (SAM, used only by `ObjectCutout.tsx`). Sizes come from `https://huggingface.co/api/models/<id>?blobs=true`, matched against the actual file(s) Transformers.js v4.2 fetches for each pipeline `MODEL_TYPE` (verified by reading `node_modules/@huggingface/transformers/src/models/session_config.js` — e.g. `Seq2Seq`/`Vision2Seq` types fetch only `encoder_model` + `decoder_model_merged`, never the separate `decoder_model`/`decoder_with_past_model` files) and the actual resolved dtype (verified by reading `node_modules/@huggingface/transformers/src/utils/dtypes.js`: if no `dtype` is passed, WASM defaults to `q8` (`_quantized` suffix) and every other device — including `webgpu` — defaults to `fp32`, i.e. the largest, unquantized file).

| Tool (component) | Model ID | `device` in code | Resolved dtype | Files fetched | Size on WebGPU (fp32 default) | Size on WASM fallback (q8 default) |
|---|---|---|---|---|---|---|
| Audio/Video Transcriber (`AudioTranscriber.tsx`) | `Xenova/whisper-base` | `"auto"` | fp32 (webgpu) / q8 (wasm) — not specified in code | encoder_model + decoder_model_merged | 78.7MB + 198.9MB = **277.6MB** | 22.1MB + 51.2MB = **73.3MB** |
| Subtitle Studio transcribe (`subtitle-studio/TranscribePanel.tsx`) | `Xenova/whisper-base` | `"auto"` | same as above | same as above | **277.6MB** | **73.3MB** |
| Image Upscaler (`ImageUpscaler.tsx`) | `Xenova/swin2SR-classical-sr-x2-64` | `"auto"` | fp32/q8 — not specified | single `model` file | **51.9MB** | **20.5MB** |
| PII Redactor (`PiiRedactor.tsx`) | `Xenova/bert-base-NER` | `"wasm"` (forced) | q8 (not specified, forced by device) | single `model` file | n/a (WASM only) | **103.9MB** |
| Translator (`Translator.tsx`) | `Xenova/m2m100_418M` | `"auto"` | **`"q8"` — explicit in code, same on both device paths** | encoder_model + decoder_model_merged | **602.7MB** (274.5MB + 328.2MB) | **602.7MB** (same, dtype forced) |
| Image Captioner (`ImageCaptioner.tsx`) | `Xenova/vit-gpt2-image-captioning` | `"auto"` | fp32/q8 — not specified | encoder_model + decoder_model_merged | 327.5MB + 586.5MB = **914.0MB** | 83.4MB + 151.3MB = **234.7MB** |
| Depth Map (`DepthMap.tsx`) | `onnx-community/depth-anything-v2-small` | `"auto"` | fp32/q8 — not specified | single `model` file | **94.5MB** | **26.0MB** |
| Zero-Shot Classifier (`ZeroShotClassifier.tsx`) | `Xenova/nli-deberta-v3-xsmall` | `"wasm"` (forced) | q8 (forced) | single `model` file | n/a | **83.2MB** |
| Text Summarizer (`TextSummarizer.tsx`) | `Xenova/distilbart-cnn-6-6` | `"wasm"` (forced) | q8 (forced) | encoder_model + decoder_model_merged | n/a | 122.9MB + 147.9MB = **270.8MB** |
| Sentiment Analyzer (`SentimentAnalyzer.tsx`) | `Xenova/distilbert-base-uncased-finetuned-sst-2-english` | `"wasm"` (forced) | q8 (forced) | single `model` file | n/a | **64.5MB** |
| Object Cutout / SAM (`ObjectCutout.tsx` via `src/lib/sam-segment.ts`) | `Xenova/slimsam-77-uniform` | `hasWebGPU() ? "webgpu" : "wasm"` (auto-detected) | **`"fp16"` — explicit in code, same on both paths** | vision_encoder + prompt_encoder_mask_decoder | **19.8MB** (11.6MB + 8.2MB) | **19.8MB** (same, dtype forced) |

Notable outliers: **Translator downloads ~603MB on every device**, and **Image Captioner downloads up to ~914MB** on any WebGPU-capable browser (Chrome/Edge and recent Safari) since it doesn't pin a dtype and falls through to Transformers.js's unquantized fp32 default — nearly 4x larger than its WASM-fallback size. This looks unintentional relative to the other `"auto"`-device tools, none of which explicitly request a smaller dtype either, so the same WebGPU/fp32 blowup applies to Whisper (278MB), the upscaler (52MB), and depth estimation (94.5MB) too — just less dramatically.

**Disclosure to the user before download starts: NO, for all ten tools.** Read every listed component: each shows a `Progress` bar (`@/components/ui/progress`) driven by `onProgress`/`LoadProgress.percent`, which only starts rendering after the user triggers the action (clicking Transcribe/Upscale/Translate/etc.) and only reports a 0–100 percentage — never a byte count, MB estimate, or any upfront size disclosure. There is no consent step, size estimate, or warning shown before the download begins for any of the ten tools. A user on a metered connection who clicks "Caption Image" has no way to know they're about to pull down close to a gigabyte before the download starts.

---

## 8. Prioritized recommendations

| Item | Impact | Effort | Rationale |
|---|---|---|---|
| Fix `/tools/calculator` to use `generateToolMetadata` | High | Trivial | Currently self-canonicalizes to the homepage and duplicates its own title — actively suppresses this page from independent indexing. One-file change, same pattern as the other 175 routes. |
| Fix blog `BlogPosting` JSON-LD delivery | High | Low | ~537 blog posts currently emit zero valid structured data because it's wired through `metadata.other` instead of a rendered `<script type="application/ld+json">`. Move it into a real script tag (e.g. reuse `JsonLdScript` in the blog post page/layout). |
| Remove or fix the self-referential hreflang cluster | Medium-High | Low (remove) | 10 identical-URL hreflang links per page are inert at best, and a plausible negative signal at worst, since they don't match the one-URL-per-locale reality. Either drop the `languages` map until real locale URLs exist, or scope it down to just `x-default` + `en`. |
| Shorten the tool title template | Medium | Low | 176/176 titles exceed 60 chars (min 72, max 101) — every tool title risks SERP/AI-citation truncation. The `generateToolMetadata` template in `src/lib/metadata.ts` is one string. |
| De-duplicate the meta description tail | Medium | Low | 57% of every tool's meta description is byte-identical boilerplate across all 176 pages — vary or shorten the fixed tail. |
| Disclose on-device model size before download | Medium | Medium | None of the 10 Transformers.js tools show a size estimate before the download starts; Translator (~603MB) and Image Captioner (up to ~914MB on WebGPU) are large enough that this is a real trust/UX gap, not just a nice-to-have. |
| Pin an explicit `dtype` on the five unpinned `"auto"`-device tools | Medium | Low | Whisper, the image upscaler, image captioner, and depth estimator all fall through to Transformers.js's unquantized fp32 default on any WebGPU browser — up to 4x larger than necessary (Image Captioner: 235MB → 914MB). Two other tools (Translator, SAM) already pin `dtype` deliberately; the rest look like an oversight rather than a choice. |
| Replace the 126 `buildFallbackContent` pages with real per-tool content, starting with the highest-traffic slugs | High | High | 72% of the catalog runs on templated content that is 74-81% byte-identical across pages — the actual thin/duplicate-content exposure (word counts themselves are all above 100, so this isn't caught by a word-count check). Best done incrementally, prioritized by traffic/impressions data this audit doesn't have access to. |
| Clean up dead `StructuredData` code paths (`type="tool"`/`type="organization"`) and the `BreadcrumbList` category crumb pointing at `/` | Low | Low | Not user- or crawler-facing (dead code isn't rendered; the breadcrumb issue is a minor schema smell), but easy to fix while touching this area. |
| Solve locale-URL indexability (8 of 9 locales have zero indexable URLs) | Very High | Very High | This is the big one and it's architecturally constrained, not a quick fix. There is no `[locale]` route segment and no middleware — i18n is entirely client-side (Zustand + next-intl), so ar/es/pt-BR/fr/de/ru/id/zh-CN each have 0 URLs a search engine or AI crawler can independently index, cite, or rank. A full fix (per-locale static routes) would multiply the static route count from ~714 to potentially 176 tools × 9 locales + ~537 blog × up to 9 locales — many thousands of pages — against a build that already needs `vercel.json`'s `NODE_OPTIONS=--max-old-space-size=4096` and `next.config.ts`'s `webpackMemoryOptimizations: true` just to survive its current ~714-page static export (the project has OOM'd on Vercel's build container before, per the comment in `next.config.ts`). Any real fix needs a rendering-strategy decision (ISR/dynamic rendering for locale variants rather than full static export, or a phased locale rollout starting with 1-2 high-value locales) rather than "just add more routes." |

---

## Verification

- `bunx tsc --noEmit`: clean, no output.
- `bun run test`: 1176 tests total. One test (`MetaTagsGenerator.test.tsx` > "parses pasted HTML head meta tags into the fields") failed with a 5000ms timeout when run as part of the full suite, but passes in isolation (`bunx vitest run src/__tests__/components/MetaTagsGenerator.test.tsx` → 6/6 pass in 2.77s). This is pre-existing test-runner flakiness under parallel load, unrelated to this change — no application or test code was touched by this audit.
- No application code was changed. Only this file was added.

## TODO(verify)

- Whether `Claude-User` / `Claude-SearchBot` requests actually reach the site distinctly from generic traffic in server logs — I confirmed the robots.txt rule (wildcard covers them) but have no access to real request logs to confirm crawl behavior in practice.
- Real-world WebGPU adoption share among BrowseryTools' actual visitors, which determines whether most users hit the fp32 (large) or q8 (small) path for the five unpinned `"auto"`-device AI tools — no analytics access.
- Whether Vercel's build container would in fact OOM at a specific locale-URL page count; the ~4GB heap cap and prior OOM history are confirmed from `vercel.json`/`next.config.ts`, but the precise page-count ceiling is not something I load-tested.
