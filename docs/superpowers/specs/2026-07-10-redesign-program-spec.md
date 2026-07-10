# BrowseryTools Redesign Program — Spec

**Date:** 2026-07-10
**Status:** Approved direction (user-validated via live /preview prototype iterations)
**Companion docs:** `2026-07-10-tools-audit-and-wave-roadmap-design.md` (audit + growth waves), `src/app/preview/` (reference implementation)

## 1. What this program is

Three workstreams, sequenced so nothing breaks:

1. **Wave R1 — Foundation refactor + test safety net.** Extract the shared primitives every tool duplicates today (measured: `useDropzone` in 24 components, hand-rolled `createElement("a")` downloads in 68, `clipboard.writeText` in 75, `canvasToBlob` copy-pasted in 10, `formatTime` in 6, gif.js encode ×3), and build the test net (unit + integration + auto-generated e2e smoke over every tool route) BEFORE any visual change. Includes the Phase 0 honesty fixes from the audit spec.
2. **Wave R2 — Design-system rollout.** Promote the /preview prototype into the real app: tokens, rail layout, landing page, ⌘K, five-zone tool template, category reorg, batch migration of all tool pages.
3. **Growth waves 1–8** — unchanged in content from the audit spec, renumbered in time; every new tool ships on the new system.

## 2. Design tokens (exact, extracted from the validated prototype)

Source of truth: `src/app/preview/preview.module.css`. R2 promotes these to `globals.css` custom properties + Tailwind theme.

### 2.1 Color

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#FCFCFB` | page canvas |
| `--surface` | `#FFFFFF` | cards, tiles, inputs |
| `--ink` | `#161615` | primary text, dark pills |
| `--muted` | `#8A8A85` | secondary text |
| `--faint` | `#B6B6B0` | tertiary/labels |
| `--line` | `rgba(22,22,21,0.09)` | hairline borders |
| `--line-strong` | `rgba(22,22,21,0.16)` | hover borders, input borders |
| `--accent` | `#2E5CFF` | electric cobalt — focus, links, AI category |
| `--green` | `#1A9E57` | on-device badge, savings stats |
| rail inactive text | `#767676` | measured off recent.design (oklch 0.556) |
| rail active text | `#000000` | active = color swap only, weight stays 400 |
| gray fill | `#EFEFEF` | inactive pills, sponsor logo tile, star badge |
| gray fill hover | `#E4E4E4` | |
| pill active bg / text | `#202020` / `#FCFCFC` | |
| pill inactive text | `rgba(0,0,0,0.49)` | |
| divider/progress track | `rgba(0,0,0,0.09)` | 1px; sponsor progress fills `#000` over it |
| "new" pink | `#D6409F` (Radix pink-9) | |
| star gold | `#F5B301` | GitHub badge |
| coffee brown | `#A26B3C` | coffee icon |

### 2.2 Category colors (chip system — 11 pairs, whisper bg / deep fg)

| Category id | bg | fg |
| --- | --- | --- |
| imageTools | `#F1EEFD` | `#6E56CF` |
| fileTools | `#E7F3FA` | `#0E7DB8` |
| mediaTools | `#FCF1E4` | `#C46B1B` |
| textLanguage | `#ECF0FC` | `#3A5CCC` |
| dataTools | `#E5F5F1` | `#0D8A72` |
| mathFinance | `#EAF6EB` | `#2E9939` |
| productivity | `#F2F6E2` | `#5C7C0F` |
| devTools | `#EEF2F5` | `#52697A` |
| designTools | `#FDEDF7` | `#D6409F` |
| securityTools | `#FDECEC` | `#CE2C31` |
| aiTools | `#EAEFFF` | `#2E5CFF` |

### 2.3 Typography

- Family: **Inter** via `next/font/google` (replaces Geist site-wide in R2; Arabic keeps IBM Plex Sans Arabic).
- Body/rail/nav: 13px / 1.5 / 400. Active nav = color change only.
- Statement (landing h1): 21px / 600 / −0.02em. Tool title: 30px / 650 / −0.03em (max-width 52ch sub at 14px `--muted`).
- Tile name: 13px / 500, single line, ellipsis. Micro-labels: monospace stack (`ui-monospace, SF Mono, …`), 9–10.5px, uppercase, tracking 0.09–0.1em.

### 2.4 Layout & radii

- **Rail:** fixed, 220px wide, 13px left inset, `padding: 16px 0`, flex column `gap: 32px` (glyph → status → nav → bottom `margin-top:auto`). Nav pitch 23.5px (19.5px line + 4px gap). Active dot 8px, absolute in reserved `padding-right: 14px`. Logo glyph 28px, radius 7.
- **Canvas:** `margin-left: 253px` (13+220+20 gutter), `padding: 26px 48px 90px`. Mobile <900px: rail hidden (R2 designs the collapse), canvas full-width.
- **Tool grid:** `repeat(auto-fill, minmax(210px, 1fr))`, gap 12. **Tile:** height 64px fixed, radius 11, padding 0 14px, chip 32px radius 8, hover: lift −1px + `0 8px 22px -14px rgba(22,22,21,0.28)` + ↗ arrow top-right.
- **App card:** horizontal, radius 12, padding 12, viz thumbnail 128×82 radius 8, desc 2-line clamp.
- **Pills:** height 28, radius 999, font 13/400, padding 0 12.
- **Tool stage:** max-width 880px. Section label margin 26/12.

### 2.5 Motion (animations.dev rules, applied)

- Easings: `--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`.
- Press: `scale(0.97)` @160ms ease-out on every pressable. Hover states gated `@media (hover:hover) and (pointer:fine)`.
- Entrance: first-paint stagger only (data-mounted pattern), 340ms, 18ms/tile delay capped at 700ms.
- Grid filtering: framer-motion `layout` + `AnimatePresence popLayout`, 200–240ms, ease `[0.23,1,0.32,1]`.
- Rail active dot: shared `layoutId="rail-active-dot"`, spring `{duration:0.45, bounce:0.25}` — travels between items, interruptible.
- **⌘K palette: zero animation on open/close** (keyboard-initiated).
- Sponsor rotor: 10s per sponsor (`ROTATE_MS`), 1px divider fills as progress (linear), pause-on-hover freezing position, 320ms fade+blur crossfade on swap, renders `null` when list empty.
- "new" scribble: single path 33×7, stroke-draw 550ms, delay 500ms, once.
- `prefers-reduced-motion`: animations off, transforms neutralized, fades kept.

## 3. Component standards

- **Shared tool primitives (R1):** `FileDropzone`, `CopyButton`, plus libs `lib/download.ts`, `lib/clipboard.ts`, `lib/image/canvas.ts`, `lib/media/gif-encode.ts`, `lib/media/ffmpeg.ts`, `lib/time-format.ts`. A styled `DownloadButton` component arrives in R2 with the template (R1 ships the behavior in `lib/download.ts`). shadcn/ui stays the base layer (Slider/Switch/Select already shared); the new layer is tool-level composites.
- **Five-zone tool template (R2):** 1 Crumb (mono, `CATEGORY / TOOL`, category name in chip fg color) → 2 Title+sub (verb-first; sub always ends with the on-device promise) → 3 Stage (one primary surface, standard dashed dropzone empty state, swaps in place) → 4 Controls bar (one bordered card: mono labels, inputs left, live stats right w/ tabular nums, single dark-pill primary action rightmost) → 5 Related (3 same-category tiles) + SEO content block.
- **Ads:** native only — rail sponsor rotor + one dashed grid tile; labeled `SPONSOR`; nothing renders when unsold.
- **Hard rules:** never a single-edge accent bar on any card; no fake metrics (GitHub stars fetched live, hidden on failure); one coffee CTA per screen.

## 4. Testing strategy (the "nothing breaks" contract)

1. **Unit (Vitest v4 + RTL, happy-dom):** every shared primitive and lib gets tests before migration; existing 134 tests must stay green throughout. Known harness patterns (clipboard getter mock, toast callable mock, pointer-capture stubs) documented in `src/test-setup.ts` and memory.
2. **Integration:** per migrated tool, one RTL test driving the real user flow (load → interact → output) with engines mocked at lib boundary.
3. **E2E (Playwright, existing config: chromium/firefox/Pixel 5, webServer `bun run start`):**
   - **Auto-generated smoke over ALL tool routes** from `tools-config` (page renders h1, no console `error`s) — created FIRST in R1, before any refactor, as the regression net; re-run per migration batch.
   - Deep flows for high-traffic tools (compressor, PDF, converter, transcriber) added as they're migrated.
4. **CI:** existing workflow (validate → lint → unit → build) gains a `e2e-smoke` job (chromium only, `--project=chromium`).
5. **Migration protocol per batch:** migrate ≤20 tools → unit + integration green → smoke green → visual spot-check → commit. A batch that breaks reverts as one unit.

## 5. Program sequence (supersedes week numbers in the audit spec; wave contents unchanged)

| Wave | Weeks | Content | Gate |
| --- | --- | --- | --- |
| **R1 Foundation** | 1–2 | Smoke net, shared primitives, hotspot migrations, honesty fixes (audit §4.1) | all-routes smoke green, unit suite green, no marketing-vs-code lies left |
| **R2 Design system** | 3–5 | Tokens → globals, rail shell + landing + ⌘K, five-zone template, batch-migrate 137 tools, category reorg (Tests & Games / School & Learning / Business), logo swap | every tool on template, smoke green, Lighthouse ≥ current |
| Growth W1 Instant volume | 6–7 | audit §5 Wave 1 | |
| Growth W2 PDF Workbench (+invoice $ experiment) | 8–9 | audit §5 Wave 2 | |
| Growth W3 Benchmark suite | 10–11 | audit §5 Wave 3 | |
| Growth W4 Daily-return packs | 12–13 | audit §5 Wave 4 | |
| Growth W5 Subtitle Studio | 14–15 | audit §5 Wave 5 | |
| Growth W6 Audio wave | 16–17 | audit §5 Wave 6 | |
| Growth W7 Document conversion | 18–19 | audit §5 Wave 7 | |
| Growth W8 Local-AI headliner | 20–21 | audit §5 Wave 8 | |

Each wave gets its own implementation plan at kickoff. R1's plan: `docs/superpowers/plans/2026-07-10-wave-r1-foundation-plan.md`.

## 6. R2 scope — cross-cutting workstreams (added after adversarial completeness review, 2026-07-10)

An independent review of the spec against production found the prototype-derived scope missing several things the live app hard-depends on. These are **in scope for R2** and gate its exit:

1. **Dark mode is a hard gate, not an open item.** Providers ship `next-themes defaultTheme="system"` — a large cohort renders dark today. Every token in §2.1/§2.2 gets a `.dark` counterpart; the migration smoke must pass under `prefers-color-scheme: dark`. The prototype's hardcoded hex values are promoted to CSS custom properties precisely so this is one mapping, not 137 edits.
2. **i18n for all new chrome.** New namespaces `Landing`, `Rail`, `Template` (statement, search placeholder, section labels, live-demo copy, sponsor label, on-device promise, related label, app-card copy) injected across all 9 locale files. The prototype's `.replace(" Tools", "")` category-label hack is replaced with translated short-labels (`ToolsConfig.categories` already exists per locale). `MISSING_MESSAGE` throws at render — typecheck + validate enforce completeness.
3. **RTL/Arabic layout.** All rail/canvas/stage positioning converts to logical properties (`inset-inline-start`, `margin-inline-start`, `padding-inline`); rail sits right in `dir=rtl`; Arabic keeps IBM Plex Sans Arabic (prototype's latin-only Inter is insufficient); RTL visual check joins the per-batch migration protocol (§4.5).
4. **Chrome replacement, explicitly.** The rail replaces `Header` + `Sidebar` and must absorb their functions: **LanguageSwitcher and ThemeSwitcher get rail slots** (a 9-locale, dual-theme site cannot lose both controls). `CoffeeBanner` (global 8s popup) and the header coffee button are **retired** — the template's single coffee CTA is the only one, honoring the one-per-screen rule. `GitHubStarBanner` is superseded by the rail's live star badge. `DynamicTitle` and `NavigationTracker` are kept as-is.
5. **Landing SEO parity.** The new landing must keep: `StructuredData type="website"` (the 137-item `ItemList` JSON-LD), a full-catalog crawlable link surface (all 137 tool links — an "all tools" section or footer matrix; the prototype's 47-tile subset is insufficient), `HomeFAQ`, and a real footer (categories, alternatives-to column, GitHub, license — plus new minimal `/privacy` and `/terms` routes, which don't exist today). The `?search=` redirect and its `SearchAction` JSON-LD are preserved; ⌘K + landing search-button **supersede** the homepage/sidebar inputs and `e2e/search.spec.ts` is rewritten to the new contract.
6. **Featured apps honesty rule.** An app card appears only when its route is live. Until growth waves deliver Subtitle Studio (W5) / Chat-with-PDF (W8) / Benchmark Suite (W3), the strip features existing headliners: Audio/Video Transcriber, PDF Tools, Image Compression, Screen Recorder. Cards swap in as waves ship.
7. **Favorites / recent / view-mode.** Favorites and recent-tools stores survive as a landing row (and power future rail pins); the grid/list `viewMode` preference is dropped — the new grid is the one view. Recorded as a deliberate simplification.
8. **Template zone 5 = the existing `ToolSeoContent`** (per-tool FAQ + JSON-LD already appended by `tools/layout.tsx`) restyled into the template — never a second SEO block.
9. **PWA/meta refresh.** `manifest.ts` + home metadata still say "30+ tools" (actual 137); `theme_color`/`background_color`/root `themeColor` update to the new tokens; branded OG/twitter images regenerate after the logo swap.
10. **Blog/coffee chrome: out of R2 scope, by declaration.** `/blog` keeps its own chrome this wave; the seam is documented and rail→Blog remains a normal link. Unifying blog chrome is a candidate for a later wave.

## 7. Open items

- Logo: "b_" browser-cursor concept prompt delivered; SVG selection pending → mounts in rail during R2 (OG image regeneration follows it, §6.9).
- Mobile rail collapse pattern: designed in R2 (bottom sheet or top bar — decide with prototype).
- `docs/` is gitignored in the repo; this branch adds exceptions (`docs/*` + `!docs/superpowers/`) so specs/plans version with the code.
