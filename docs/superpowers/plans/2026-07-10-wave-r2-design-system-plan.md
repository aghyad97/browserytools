# Wave R2: Design-System Rollout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the validated `/preview` prototype into the production app — tokens, rail chrome, landing, ⌘K, five-zone tool template — across all 137 tools, 9 locales (incl. RTL Arabic), and both themes, with zero SEO regression.

**Architecture:** Token layer first (light+dark CSS custom properties), then i18n keys, then the chrome (Rail replaces Header/Sidebar), then the landing (SEO-parity rules), then the template + 7 migration batches gated by the R1 smoke suite. The prototype at `src/app/preview/` is the visual source of truth; this plan ports it with the four production requirements it lacks: i18n, RTL, dark mode, SEO surface.

**Tech Stack:** Next.js App Router, CSS custom properties + CSS Modules (+ existing Tailwind for tool internals), next-intl-style client i18n (`useTranslations` via `src/providers/language-provider.tsx`), next-themes, framer-motion, Inter + IBM Plex Sans Arabic via next/font.

## Prerequisites (hard)

- **Wave R1 is merged.** This plan consumes R1's interfaces: `FileDropzone`, `CopyButton`, `downloadBlob/downloadUrl/downloadText` (`@/lib/download`), `copyText` (`@/lib/clipboard`), `canvasToBlob/loadImage` (`@/lib/image/canvas`), `encodeGif` (`@/lib/media/gif-encode`), `getFFmpeg` (`@/lib/media/ffmpeg`), `formatStopwatch/formatMMSS/playBeep` (`@/lib/time-format`), and the smoke gate `bun run e2e:smoke` (all 137 routes).
- Program spec `docs/superpowers/specs/2026-07-10-redesign-program-spec.md` — §2 tokens, §3 standards, §6 cross-cutting workstreams — is the contract this plan implements. Read it before any task.
- Reference implementation `src/app/preview/{page.tsx, tool/page.tsx, ui.tsx, preview.module.css}` (committed on this branch). Port from it; don't redesign.

## Global Constraints

- All 358+ unit tests and the 137-route smoke suite stay green after every task.
- Every user-visible string added in this wave gets keys in ALL 9 locale files (en, ar, es, pt-BR, fr, de, ru, id, zh-CN) — `MISSING_MESSAGE` throws at render; `npx tsc --noEmit` + `bun run validate` enforce.
- All new layout CSS uses **logical properties** (`inset-inline-start`, `margin-inline-start`, `padding-inline`, `text-align: start`) — never `left/right` — so `dir="rtl"` mirrors free. The two exceptions: animations translating decorative arrows may stay physical if visually symmetric.
- Every token has light AND dark values; no component hardcodes a hex.
- No slug/URL changes anywhere. `sitemap.ts` untouched except additions (`/privacy`, `/terms`).
- Never a single-edge colored border on any card. Ads native + labeled only. One coffee CTA per screen. No fabricated metrics.
- Commits: conventional, no Co-Authored-By.

---

### Task 1: Token layer — `src/styles/design-tokens.css` (light + dark)

**Files:**
- Create: `src/styles/design-tokens.css`
- Modify: `src/app/globals.css` (import at top)
- Test: `src/__tests__/lib/design-tokens.test.ts` (parse + completeness check)

**Interfaces:**
- Produces: CSS custom properties on `:root` (light) and `.dark` — every later task styles exclusively via `var(--bt-*)`.

- [ ] **Step 1: Write the failing completeness test** (reads the css file, asserts every required token exists in BOTH scopes)

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const REQUIRED = [
  "--bt-bg", "--bt-surface", "--bt-ink", "--bt-muted", "--bt-faint",
  "--bt-line", "--bt-line-strong", "--bt-accent", "--bt-green",
  "--bt-nav-idle", "--bt-nav-active", "--bt-fill", "--bt-fill-hover",
  "--bt-pill-active-bg", "--bt-pill-active-fg", "--bt-pill-idle-fg",
  "--bt-divider", "--bt-new-pink", "--bt-star", "--bt-coffee",
  ...["image","file","media","text","data","math","prod","dev","design","sec","ai"]
    .flatMap((c) => [`--bt-cat-${c}-bg`, `--bt-cat-${c}-fg`]),
  "--bt-ease-out", "--bt-ease-in-out",
];

describe("design tokens", () => {
  const css = readFileSync("src/styles/design-tokens.css", "utf8");
  const root = css.split(".dark")[0];
  const dark = css.split(".dark")[1] ?? "";
  it.each(REQUIRED)("%s defined in :root", (t) => expect(root).toContain(`${t}:`));
  it.each(REQUIRED.filter((t) => !t.includes("ease")))("%s overridden in .dark", (t) =>
    expect(dark).toContain(`${t}:`),
  );
});
```

- [ ] **Step 2: Run — FAIL (file missing). Implement with the exact values**

```css
/* BrowseryTools design tokens — spec §2. Light is default; .dark overrides. */
:root {
  --bt-bg: #fcfcfb;
  --bt-surface: #ffffff;
  --bt-ink: #161615;
  --bt-muted: #8a8a85;
  --bt-faint: #b6b6b0;
  --bt-line: rgba(22, 22, 21, 0.09);
  --bt-line-strong: rgba(22, 22, 21, 0.16);
  --bt-accent: #2e5cff;
  --bt-green: #1a9e57;
  --bt-nav-idle: #767676;
  --bt-nav-active: #000000;
  --bt-fill: #efefef;
  --bt-fill-hover: #e4e4e4;
  --bt-pill-active-bg: #202020;
  --bt-pill-active-fg: #fcfcfc;
  --bt-pill-idle-fg: rgba(0, 0, 0, 0.49);
  --bt-divider: rgba(0, 0, 0, 0.09);
  --bt-new-pink: #d6409f;
  --bt-star: #f5b301;
  --bt-coffee: #a26b3c;

  --bt-cat-image-bg: #f1eefd;  --bt-cat-image-fg: #6e56cf;
  --bt-cat-file-bg: #e7f3fa;   --bt-cat-file-fg: #0e7db8;
  --bt-cat-media-bg: #fcf1e4;  --bt-cat-media-fg: #c46b1b;
  --bt-cat-text-bg: #ecf0fc;   --bt-cat-text-fg: #3a5ccc;
  --bt-cat-data-bg: #e5f5f1;   --bt-cat-data-fg: #0d8a72;
  --bt-cat-math-bg: #eaf6eb;   --bt-cat-math-fg: #2e9939;
  --bt-cat-prod-bg: #f2f6e2;   --bt-cat-prod-fg: #5c7c0f;
  --bt-cat-dev-bg: #eef2f5;    --bt-cat-dev-fg: #52697a;
  --bt-cat-design-bg: #fdedf7; --bt-cat-design-fg: #d6409f;
  --bt-cat-sec-bg: #fdecec;    --bt-cat-sec-fg: #ce2c31;
  --bt-cat-ai-bg: #eaefff;     --bt-cat-ai-fg: #2e5cff;

  --bt-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --bt-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}

.dark {
  --bt-bg: #0e0e0d;
  --bt-surface: #161615;
  --bt-ink: #f1f1ef;
  --bt-muted: #8f8f89;
  --bt-faint: #5c5c57;
  --bt-line: rgba(241, 241, 239, 0.09);
  --bt-line-strong: rgba(241, 241, 239, 0.17);
  --bt-accent: #5d80ff;
  --bt-green: #2fbf75;
  --bt-nav-idle: #8f8f89;
  --bt-nav-active: #ffffff;
  --bt-fill: #232322;
  --bt-fill-hover: #2c2c2b;
  --bt-pill-active-bg: #e8e8e6;
  --bt-pill-active-fg: #111110;
  --bt-pill-idle-fg: rgba(255, 255, 255, 0.55);
  --bt-divider: rgba(255, 255, 255, 0.1);
  --bt-new-pink: #e15bb0;
  --bt-star: #f5b301;
  --bt-coffee: #c08654;

  --bt-cat-image-bg: rgba(110, 86, 207, 0.2);  --bt-cat-image-fg: #a292e6;
  --bt-cat-file-bg: rgba(14, 125, 184, 0.2);   --bt-cat-file-fg: #63b3dd;
  --bt-cat-media-bg: rgba(196, 107, 27, 0.2);  --bt-cat-media-fg: #e0a06a;
  --bt-cat-text-bg: rgba(58, 92, 204, 0.2);    --bt-cat-text-fg: #8fa6ea;
  --bt-cat-data-bg: rgba(13, 138, 114, 0.2);   --bt-cat-data-fg: #5cc2ab;
  --bt-cat-math-bg: rgba(46, 153, 57, 0.2);    --bt-cat-math-fg: #7cc884;
  --bt-cat-prod-bg: rgba(92, 124, 15, 0.22);   --bt-cat-prod-fg: #a9c25e;
  --bt-cat-dev-bg: rgba(82, 105, 122, 0.25);   --bt-cat-dev-fg: #9fb4c4;
  --bt-cat-design-bg: rgba(214, 64, 159, 0.2); --bt-cat-design-fg: #e58cc4;
  --bt-cat-sec-bg: rgba(206, 44, 49, 0.2);     --bt-cat-sec-fg: #e2807f;
  --bt-cat-ai-bg: rgba(46, 92, 255, 0.22);     --bt-cat-ai-fg: #8fa8ff;
}
```

Add `@import "../styles/design-tokens.css";` as the FIRST line of `src/app/globals.css`.

- [ ] **Step 3: Run test — PASS. `bun run build` green. Commit `feat(design): token layer, light + dark`.**

---

### Task 2: i18n — `Landing`, `Rail`, `Template` namespaces + category short-labels, ×9 locales

**Files:**
- Create: `scripts/inject-redesign-i18n.mjs`
- Modify: `messages/{en,ar,es,pt-BR,fr,de,ru,id,zh-CN}.json`

**Interfaces:**
- Produces keys consumed by Tasks 4, 5, 7, 8, 9 via `useTranslations("Landing" | "Rail" | "Template")` and `useTranslations("ToolsConfig")` for `categoriesShort.<id>`.

- [ ] **Step 1: Define the EN keyset (authoritative)**

```json
{
  "Rail": {
    "toolsOnDevice": "{count} tools · on-device",
    "everything": "Everything",
    "blog": "Blog",
    "github": "GitHub",
    "search": "Search",
    "sponsorLabel": "Sponsor",
    "new": "new",
    "language": "Language",
    "theme": "Theme"
  },
  "Landing": {
    "statementLead": "Every tool you need.",
    "statementTail": "Nothing leaves your device.",
    "searchPlaceholder": "Search {count}+ tools…",
    "demoTitle": "Try it. Drop an image here.",
    "demoTitleBusy": "Compressing…",
    "demoSub": "It compresses right here, on your device. No upload — watch the network tab.",
    "demoSmaller": "{pct}% smaller",
    "apps": "Apps",
    "popular": "Popular",
    "all": "All",
    "allTools": "All {count} tools",
    "viewAll": "View all tools",
    "onDevice": "on-device",
    "sponsorTile": "Your dev tool, native here",
    "coffee": "Buy me a coffee",
    "favorites": "Your favorites",
    "recent": "Recently used"
  },
  "Template": {
    "onDevicePromise": "Runs on your device — nothing is uploaded, nothing is stored.",
    "related": "Related",
    "startOver": "Start over",
    "download": "Download",
    "dropTitle": "Drop a file, or click to choose",
    "staysOnDevice": "stays on your device"
  }
}
```

Plus `ToolsConfig.categoriesShort`: EN values `{"imageTools":"Image","fileTools":"File","mediaTools":"Media","textLanguage":"Text","dataTools":"Data","mathFinance":"Math","productivity":"Productivity","devTools":"Dev","designTools":"Design","securityTools":"Security","aiTools":"AI"}` — translated per locale (NOT string-derived; kills the `.replace(" Tools","")` hack).

- [ ] **Step 2: Write the injection script** — same shape as R1's `sync-honest-descriptions.mjs`: `BY_LOCALE` object with the full translated keyset for all 9 locales embedded (implementer translates the ~30 short strings per locale; Arabic copy flagged for user review pre-merge; 2-space indent + trailing newline).

- [ ] **Step 3: Run, then verify: `node scripts/inject-redesign-i18n.mjs && bun run validate && npx tsc --noEmit` — all green. Commit `feat(i18n): redesign namespaces across 9 locales`.**

---

### Task 3: Inter as the latin font

**Files:**
- Modify: `src/app/layout.tsx:15` (`Geist` → `Inter`)

- [ ] **Step 1:** Replace `const geist = Geist({ subsets: ["latin"] })` with `const inter = Inter({ subsets: ["latin"] })` and `<body className={geist.className}>` → `{inter.className}`. `IBM_Plex_Sans_Arabic` stays untouched (Arabic rendering path unchanged).
- [ ] **Step 2:** `bun run build && bun run e2e:smoke` green; visually confirm one EN and one AR page. Commit `feat(design): Inter as latin font`.

---

### Task 4: Production Rail (`src/components/layout/rail.tsx` + `rail.module.css`)

**Files:**
- Create: `src/components/layout/rail.tsx`, `src/components/layout/rail.module.css`, `src/lib/sponsors.ts`
- Test: `src/__tests__/components/rail.test.tsx`

**Interfaces:**
- Consumes: `Rail`/`SponsorRotator`/`useGithubStars`/`NewTag` logic from `src/app/preview/ui.tsx` (port, don't rewrite); `Rail`+`Landing` i18n keys (Task 2); tokens (Task 1); existing `LanguageSwitcher` + `ThemeSwitcher` components (currently rendered by `header.tsx` — reuse the components, not the header).
- Produces: `<Rail activeCategory?, onCategory?, onSearch>` used by Tasks 7, 8, 9; `SPONSORS` config in `src/lib/sponsors.ts` exported as `Sponsor[]` (ships EMPTY — rotor renders nothing until a real sponsor exists; prototype's fictional entries do NOT ship).

Port rules (the four production upgrades over the prototype):
1. **Logical properties.** Every physical property converts:
   - `.rail { left: 13px }` → `inset-inline-start: 13px`
   - `.canvas { margin-left: 253px }` → `margin-inline-start: 253px`
   - `.railLink { padding: 0 14px 0 0 }` → `padding-inline-end: 14px`
   - `.activeDot { right: 0 }` → `inset-inline-end: 0`
   - `.tileArrow { right: 11px }` → `inset-inline-end: 11px`; the ↗ glyph becomes ↖ under RTL via `[dir="rtl"] .tileArrow { transform: scaleX(-1); }`
2. **i18n:** every string through `useTranslations("Rail")`; category labels via `tc("categoriesShort." + id)`.
3. **Tokens:** all hex values in the ported CSS replaced by `var(--bt-*)` equivalents (mapping is 1:1 with Task 1's table).
4. **Switcher slots:** rail bottom, above the Search pill: a compact row with `<LanguageSwitcher />` and `<ThemeSwitcher />` (import paths as used in `src/components/header.tsx` today).

- [ ] **Step 1: failing test** (renders Rail inside test i18n provider; asserts: all 11 category labels from mocked translations render; active category gets the dot element; sponsor section absent when `SPONSORS` empty).
- [ ] **Step 2:** Port + implement per rules above. **Step 3:** tests green. **Step 4:** RTL check — render with `dir="rtl"` in a Playwright fixture and screenshot; rail must sit RIGHT. **Step 5:** Commit `feat(chrome): production Rail with i18n/RTL/theming`.

---

### Task 5: Production Command Palette + search contract

**Files:**
- Create: `src/components/layout/command-palette.tsx`
- Modify: `e2e/search.spec.ts` (rewrite to new contract)
- Keep: `?search=` redirect in `src/app/(home)/page.tsx` and its `SearchAction` JSON-LD — untouched.

**Interfaces:**
- Consumes: prototype `CommandPalette`/`useCommandPalette` (port with i18n + tokens; keyboard-open stays animation-free); flattened tool list from `tools-config` with translated names via `ToolsConfig.tools.<slug>.name`.
- Produces: `<CommandPalette open onClose>` + `useCommandPalette()` used by Rail/Landing/Template. **Supersedes** the homepage search input and sidebar search (both removed with their parents in Tasks 6/7).

- [ ] Steps: failing RTL test for palette rendering translated names → port → new `e2e/search.spec.ts`: `⌘K opens palette` (keyboard), `typing filters`, `Enter navigates to tool`, `?search=json redirects` (preserved server behavior) → green → commit `feat(chrome): command palette; rewrite search e2e contract`.

---

### Task 6: Chrome switchover — retire Header/Sidebar/CoffeeBanner/GitHubStarBanner

**Files:**
- Modify: `src/app/(home)/layout.tsx`, `src/app/tools/layout.tsx`, `src/providers/providers.tsx`
- Create: `src/components/layout/footer.tsx` (new slim footer: category link columns from tools-config [full 137-link matrix], GitHub, license, `/privacy`, `/terms`, alternatives column placeholder for W1)
- Create: `src/components/layout/mobile-bar.tsx` (<900px: slim top bar — glyph, ⌘K search button, menu button opening the rail content in the existing Sheet component pattern from `header.tsx`)
- Delete usages (not files yet): `Header`, `Sidebar`, `CoffeeBanner` (from providers), `GitHubStarBanner`

**Interfaces:**
- Consumes: Rail (T4), Palette (T5), Footer (this task).
- Produces: the app shell every route renders inside. `DynamicTitle` + `NavigationTracker` + `Analytics` stay in providers untouched.

- [ ] Steps: swap layouts → remove `<CoffeeBanner />` from `providers.tsx` (single-coffee-CTA rule; landing + template CTAs are the coffee surface now) → mobile bar → `bun run test && bun run e2e:smoke` (the smoke suite is the regression net for all 137 pages under new chrome) → RTL + dark spot-check on 3 tool pages → commit `feat(chrome)!: rail shell replaces header/sidebar; retire coffee banner + star banner`.

---

### Task 7: `/privacy` + `/terms` routes

**Files:**
- Create: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, i18n keys `Legal.*` (×9 via Task 2's script pattern)
- Modify: `src/app/sitemap.ts` (add both routes)

Content (EN authoritative, short and true): privacy = no accounts, no file uploads (processing on-device), Vercel Analytics aggregate usage, GitHub-hosted code, contact; terms = AGPL-3.0 software, no warranty, free for everyone.

- [ ] Steps: pages + keys + sitemap → validate/typecheck/smoke → commit `feat(legal): privacy + terms pages`.

---

### Task 8: New landing with SEO parity

**Files:**
- Modify: `src/app/(home)/page.tsx` (keep metadata, `StructuredData type="website"`, `?search=` redirect, hreflang — replace body)
- Create: `src/components/landing/landing.tsx` + `landing.module.css` (port from `src/app/preview/page.tsx` with the four production upgrades)
- Keep: `<HomeFAQ />` rendered below the grid.
- Test: `e2e/landing.spec.ts`

**Interfaces:**
- Consumes: Rail/Palette/tokens/i18n; `LiveDemo` ported from prototype `ui.tsx`; favorites/recent stores (`src/store/favorites-store.ts`, `src/store/recent-tools-store.ts`).
- Produces: the production home.

Port deltas vs prototype (each is a §6 requirement):
1. **Full catalog**: below the "Popular" curated grid, an "All tools" section renders EVERY tool as a link grouped by category (crawlable, 137 links) — not `slice(0, 47)`.
2. **Featured apps honesty**: the Apps strip features EXISTING routes only: Audio/Video Transcriber (`/tools/audio-transcriber`), PDF Tools (`/tools/pdf`), Image Compression (`/tools/image-compression`), Screen Recorder (`/tools/screen-recorder`). Card metadata lives in `src/lib/featured-apps.ts` with a comment: growth waves swap entries in as they ship. No card without a live route.
3. **Favorites / Recently used** rows (from existing stores) between search and Apps, shown only when non-empty.
4. `StructuredData`, `HomeFAQ`, footer, metadata: preserved/rendered.

- [ ] Steps: failing `e2e/landing.spec.ts` — asserts: h1 statement (translated), ≥137 `/tools/` links, JSON-LD `ItemList` present, FAQ visible, exactly one coffee CTA → implement → smoke + landing spec green → Lighthouse: `npx lighthouse http://localhost:3000 --only-categories=seo,performance --quiet` — SEO score must be ≥ the pre-change baseline (capture baseline BEFORE the swap in this task's first step) → commit `feat(landing)!: rail landing with full-catalog SEO surface`.

---

### Task 9: Five-zone tool template

**Files:**
- Create: `src/components/template/tool-shell.tsx`, `tool-shell.module.css`, `src/components/template/controls-bar.tsx`
- Modify: `src/app/tools/layout.tsx` (ToolSeoContent renders inside zone 5 styling — never duplicated)
- Test: `src/__tests__/components/tool-shell.test.tsx`

**Interfaces:**
- Produces:

```tsx
<ToolShell
  slug="image-compression"        // resolves category, colors, crumb, related from tools-config
  title={t("title")}               // tool page provides its translated strings
  sub={t("sub")}                   // template appends Template.onDevicePromise
  controls={<.../>}                // zone 4 content (ControlsBar children)
  primaryAction={{ label, onClick, disabled }}  // single dark pill, end-aligned
>
  {stage}                          // zone 3 — the tool's primary surface
</ToolShell>
```

- Zones per spec §3: crumb (category name in `var(--bt-cat-<x>-fg)`) → title/sub → stage (max-width 880) → ControlsBar → Related (3 same-category tiles, reusing landing tile component) → ToolSeoContent.
- All logical properties; all tokens; RTL + dark by construction.

- [ ] Steps: failing render test (crumb shows category short-label + color var, related tiles = 3 same-category, promise line appended) → implement (port zone styles from `preview/tool/page.tsx` + `preview.module.css`) → green → commit `feat(template): five-zone ToolShell`.

---

### Task 10: Pilot migrations — 3 archetypes

**Files:**
- Modify: `src/components/ImageCompression.tsx` (file-tool archetype), `src/components/JsonFormatter.tsx` (text-tool archetype), `src/components/Timer.tsx` (interactive archetype) + their pages if layout-coupled

Each pilot: wrap in `ToolShell`, move its dropzone to R1's `FileDropzone` (now restyled by tokens), its copy buttons to `CopyButton`, downloads to `lib/download`. Write one RTL Playwright screenshot + one dark screenshot per pilot. Integration test per pilot driving the real flow (e.g. ImageCompression: drop fixture image → quality change → download called).

- [ ] Steps per pilot: migrate → unit+integration green → smoke green → RTL/dark screenshots reviewed → commit (`refactor(tools): <name> onto ToolShell`). Pilots are the template's proving ground — template API changes discovered here amend Task 9 BEFORE batches start.

---

### Task 11: Batch migration — all remaining tools, 7 batches

**Files:** every remaining `src/components/<Tool>.tsx` (134 after pilots)

Batches (by category, ≤22 tools each; category = shared patterns = efficient context):

| Batch | Tools | Count |
| --- | --- | --- |
| B1 | Image Tools (remaining 21 after ImageCompression) | 21 |
| B2 | AI Tools (20) | 20 |
| B3 | Text & Language (19) | 19 |
| B4 | Math & Finance (15) + File (4) | 19 |
| B5 | Data (13 after JSONFormatter) + Media (6) | 19 |
| B6 | Productivity (9 after Timer) + Developer (10) | 19 |
| B7 | Design (12) + Security (5) | 17 |

Per-batch protocol (the §4.5 contract):
- [ ] Migrate each tool onto ToolShell + R1 primitives (mechanical after pilots)
- [ ] `bun run test` green (existing tool tests unmodified)
- [ ] `bun run e2e:smoke` green
- [ ] RTL spot-check 2 tools/batch + dark spot-check 2 tools/batch (Playwright screenshots)
- [ ] One commit per batch: `refactor(tools): batch N onto ToolShell (<categories>)`
- [ ] A failing batch reverts whole; the cause is fixed in the template, not patched per-tool

---

### Task 12: Category reorg (display-only) — audit spec §4.3

**Files:**
- Modify: `src/lib/tools-config.ts` (3 new categories: Tests & Games `testsGames`, School & Learning `schoolLearning`, Business `business`; moves: formatters→Developer, color suite→Design, encoders→Data, Typing Test→testsGames, Periodic Table→schoolLearning, Invoice+Expense→business; transcription renames per audit)
- Modify: all 9 `messages/*.json` (`ToolsConfig.categories` + `categoriesShort` for 3 new ids — extend Task 2's script)
- Category colors: add 3 chip pairs to `design-tokens.css` (+dark): `--bt-cat-games-bg:#FFF0E8/--bt-cat-games-fg:#D4570E`, `--bt-cat-school-bg:#E9F4FB/--bt-cat-school-fg:#1D74A6`, `--bt-cat-biz-bg:#F0F1E4/--bt-cat-biz-fg:#77731C` (dark: 20%-alpha bg of fg, fg lightened consistent with Task 1's dark table).
- Modify: `README.md` (validate-tools sync)

- [ ] Steps: config moves → locale keys ×9 → tokens → `bun run validate && npx tsc --noEmit && bun run test && bun run e2e:smoke` → commit `feat(catalog): category reorg — Tests & Games, School & Learning, Business`.

---

### Task 13: PWA/meta refresh + logo mount

**Files:**
- Modify: `src/app/manifest.ts` ("30+ tools" → "137+ free tools & mini-apps"; `theme_color: "#FCFCFB"`, `background_color: "#FCFCFB"`), root `themeColor` in `layout.tsx` (light `#FCFCFB` / dark `#0E0E0D` media pair)
- Blocked-on-user: final "b_" SVG → `src/components/layout/logo.tsx`, `src/app/icon.svg`, favicon set, regenerate OG/twitter images (existing file-based `opengraph-image.tsx` routes get the new mark)
- If the SVG isn't chosen when this task is reached, ship everything except the logo files with the current glyph placeholder and leave THIS checkbox open — it is the only permitted open item at R2 exit.

- [ ] Steps: manifest/meta → logo files when available → build + smoke → commit `feat(brand): manifest/meta refresh (+ logo mount)`.

---

### Task 14: Cleanup + R2 exit gate

**Files:**
- Delete: `src/app/preview/` (prototype served its purpose), `src/components/header.tsx`, `src/components/sidebar.tsx`, `src/components/coffee-banner.tsx`, `src/components/GitHubStarBanner.tsx` (verify zero imports first: `grep -rn "coffee-banner\|GitHubStarBanner\|from \"@/components/header\"\|from \"@/components/sidebar\"" src/ | wc -l` → 0), old `HomePage.tsx` if fully superseded
- Remove Geist from package.json if unused.

Exit gate (all must hold):
- [ ] `bun run test` green; `bun run e2e:smoke` green ×137; `e2e/landing.spec.ts` + rewritten `e2e/search.spec.ts` green
- [ ] Every tool renders inside ToolShell (spot-verify one per category)
- [ ] Dark mode: smoke passes with `colorScheme: "dark"` context; no hardcoded hex outside `design-tokens.css` (`grep -rn "#[0-9a-fA-F]\{6\}" src/components/layout src/components/template src/components/landing | wc -l` → 0)
- [ ] RTL: Arabic locale renders rail on the right, no overlap, on landing + 3 tool pages (screenshots archived in PR)
- [ ] Lighthouse SEO ≥ baseline; JSON-LD ItemList present; ≥137 internal tool links on landing
- [ ] i18n: `bun run validate` + `npx tsc --noEmit` green (no MISSING_MESSAGE possible)
- [ ] Exactly one coffee CTA per screen; sponsor surfaces render nothing (SPONSORS=[])
- [ ] Commit `chore(redesign): remove superseded chrome + prototype`, then PR to main

## Task → model assignment

| Task | Model | Rationale |
| --- | --- | --- |
| 1 tokens | Sonnet | complete values in plan |
| 2 i18n keys ×9 | **Opus** | translation quality; AR user-reviewed pre-merge |
| 3 Inter | Sonnet | two-line change |
| 4 Rail port | **Opus** | RTL/logical-props conversion + switcher integration judgment |
| 5 Palette + search contract | **Opus** | supersedes live search paths; e2e rewrite |
| 6 Chrome switchover | **Opus** + Fable review before commit | highest-blast-radius task in the program |
| 7 legal pages | Sonnet | short specified content |
| 8 Landing | **Opus** + Fable review | SEO parity stakes |
| 9 ToolShell | **Opus** | the API 137 tools will live on |
| 10 Pilots | **Opus** | template proving ground |
| 11 Batches ×7 | Sonnet (mechanical after pilots), Fable reviews each batch diff | |
| 12 Reorg | Sonnet | mapping fully specified |
| 13 PWA/logo | Sonnet | |
| 14 Cleanup/gate | Fable (main session) | deletions + final verification never delegated |
