# Wave 1 — Instant Volume (spec)

**Date:** 2026-07-16 · **Branch:** `wave-1-instant-volume` (off main) · **Roadmap:** §5 Wave 1 of `2026-07-10-tools-audit-and-wave-roadmap-design.md` · **Design contract:** `2026-07-12-wave-r3-interior-contract.md` (binding)

**Goal:** ship the highest traffic-per-hour batch: a target-file-size compressor engine, a 14-page programmatic landing family over existing engines, and 5 new standalone tools — all client-side, all per the R3 interior contract.

## 1. Inventory (19 new routes)

### 1.1 New standalone tools (5) — appear in grid, README, count
| Slug | Component | Category | Notes |
|---|---|---|---|
| `crop-image` | `CropImage` | imageTools | extracted from ImageResizer crop tab |
| `watermark-image` | `WatermarkImage` | imageTools | extracted from ImageResizer watermark tab |
| `keyboard-tester` | `KeyboardTester` | testsGames | greenfield |
| `gamepad-tester` | `GamepadTester` | testsGames | greenfield |
| `dead-pixel-test` | `DeadPixelTest` | testsGames | greenfield |

### 1.2 Programmatic landing variants (14) — hidden from grid/count, in sitemap/e2e/SEO
| Slug | Renders | Preset |
|---|---|---|
| `compress-image-to-20kb` | ImageCompression | target mode, 20 KB |
| `compress-image-to-50kb` | ImageCompression | target 50 KB |
| `compress-image-to-100kb` | ImageCompression | target 100 KB |
| `compress-image-to-200kb` | ImageCompression | target 200 KB |
| `compress-image-to-500kb` | ImageCompression | target 500 KB |
| `compress-image-to-1mb` | ImageCompression | target 1024 KB |
| `compress-jpeg-to-50kb` | ImageCompression | target 50 KB + format locked jpeg |
| `compress-jpeg-to-100kb` | ImageCompression | target 100 KB + jpeg |
| `compress-jpeg-to-200kb` | ImageCompression | target 200 KB + jpeg |
| `compress-signature-20kb` | ImageCompression | target 20 KB + jpeg (10–20 KB signature-for-forms copy) |
| `heic-to-jpg` | ImageConverter | HEIC accept emphasis, output jpeg |
| `heic-to-png` | ImageConverter | HEIC accept emphasis, output png |
| `mic-test` | MicTester (split panel) | mic-only |
| `webcam-test` | WebcamTester (split panel) | camera-only |

`landingFor` canonical mapping: compress-* → `image-compression`; heic-* → `image-converter`; mic/webcam → `mic-camera`.

## 2. Engine: target-size compression

New `src/lib/image/target-size.ts`, pure and unit-testable (encoder injected):

```ts
interface TargetSizeRequest {
  source: HTMLImageElement | ImageBitmap;
  targetBytes: number;
  format: "image/jpeg" | "image/webp";   // PNG excluded — no quality knob
  minWidth?: number;                      // dimension floor, default 160
  encode?: (canvas, type, q) => Promise<Blob | null>; // default canvasToBlob (injectable for tests)
}
interface TargetSizeResult {
  blob: Blob; width: number; height: number;
  quality: number; iterations: number;
  hitTarget: boolean;                     // false = best effort (target unreachably small)
}
compressToTargetSize(req): Promise<TargetSizeResult>
```

Algorithm: binary-search quality in [0.30, 0.95] at current dimensions (≤7 encodes, accept within −10%..0% of target). If floor quality still exceeds target, scale dimensions by `sqrt(target/actual)` (clamped ≥ minWidth) and re-search; max 3 dimension steps. Never upscale. If still over target at floor, return smallest achieved with `hitTarget:false`. Uses `canvasToBlob` (Blob.size), NOT `toDataURL`/atob.

Unit tests: mock encoder with a deterministic size model (monotonic in quality × pixels); assert convergence, tolerance window, dimension step-down, unreachable-target best-effort, no-upscale.

## 3. Component changes

### 3.1 ImageCompression — target mode + presets
- New mode `"target"` alongside auto/aggressive/custom: target-size input (KB) + preset chips (20/50/100/200/500/1024). In target mode, quality/maxWidth controls hide; result StatStrip shows achieved size, dimensions, quality used, and a "couldn't reach target" notice when `hitTarget:false`. PNG output disallowed in target mode (auto-fallback to JPEG with a hint string).
- New props (all optional; default behavior unchanged):
  `{ slug?: string; preset?: { mode?: Mode; targetKb?: number; format?: TargetFormat; lockFormat?: boolean } }`
  `slug` (default `"image-compression"`) drives ToolShell slug/title/sub via `tc("tools.<slug>.*")`. `lockFormat` hides the format select.
- Encode path for target mode goes through the new engine; existing modes untouched.
- New `Tools.ImageCompression` keys (×9): `modeTarget, targetSize, targetSizeHint, targetReached, targetMissed, pngNotSupportedInTarget` (final list at implementation).

### 3.2 ImageConverter — HEIC presets
- Props `{ slug?: string; preset?: { targetFormat?: string; lockFormat?: boolean; heicEmphasis?: boolean } }`.
- HEIC ingest fix: heic2any converts to PNG (lossless intermediate) instead of JPEG, then normal re-encode to targetFormat (avoids double-lossy HEIC→JPEG→X). `heicEmphasis` adjusts dropzone copy (accept hint mentions .heic first).
- Existing default behavior otherwise unchanged.

### 3.3 MicCameraTester — split
- Factor into `MicTesterPanel` + `WebcamTesterPanel` (shared device-enumeration hook). `MicCameraTester` composes both — zero behavior change at `/tools/mic-camera`.
- New thin components `MicTester` / `WebcamTester` wrap one panel in ToolShell with slugs `mic-test` / `webcam-test`. Panels keep consuming `Tools.MicCameraTester` strings (already ×9) — no new namespace.

### 3.4 Crop/Watermark breakouts
- Extract crop overlay (rect state, pointer handlers, aspect presets) and watermark controls (text/image, 9-anchor, opacity/scale/rotation/tile) from ImageResizer into shared modules under `src/lib/image/` (pure math: `cropRect.ts`, `watermark-draw.ts`) + shared UI subcomponents where clean.
- New `CropImage` / `WatermarkImage` standalone tools (own ToolShell, FileDropzone, format+quality export controls, `finishExport`-style pipeline via `canvasToBlob`).
- ImageResizer keeps all three tabs (URL + behavior stable) but consumes the extracted shared logic — no duplicated math. Existing ImageResizer tests must stay green.
- New namespaces `Tools.CropImage`, `Tools.WatermarkImage` (×9) — may mirror existing ImageResizer strings.

### 3.5 New testers (greenfield, testsGames)
- **KeyboardTester**: visual ANSI keyboard, keys light on `keydown`/`keyup` (event.code), pressed-history, currently-held list, key-rollover count, reset. Prevent-default for space/tab while focused. No sounds needed.
- **GamepadTester**: `navigator.getGamepads()` rAF polling behind `gamepadconnected`; per-pad buttons (pressed/value) + axes visualization (stick dots), vibration test where `vibrationActuator` exists, "connect a controller" empty state.
- **DeadPixelTest**: fullscreen solid-color cycler (white/black/R/G/B/custom) via `requestFullscreen` (pattern: Timer.tsx:130), click/arrow to advance, Esc hint, instructions card for spotting stuck vs dead pixels.
- All three: ToolShell + shared molecules + `var(--bt-*)` tokens only, logical CSS, both themes, RTL-safe, unit tests (happy-dom: synthetic KeyboardEvents; mocked getGamepads; mocked requestFullscreen).

## 4. Landing-variant infrastructure

New optional `Tool.landingFor?: string` (canonical slug) in tools-config:
- **Included**: sitemap, `generateToolMetadata`, e2e route generation (keep `name`→`href`→`available` field order; `landingFor` after), ToolSeoContent zone, HAS_OWN_H1.
- **Excluded**: landing grid/category display, `roundedToolCount()`, "new tool" badges, related-tiles pools of non-landing tools.
- **Related tiles ON a landing page**: canonical tool first, then sibling variants of the same `landingFor` family (§7 internal linking: 20kb ↔ 50kb ↔ … ↔ compressor).
- **validate-tools.js**: entries with `landingFor` exempt from README bullet requirement.
- Unit tests for count/grid-filter/related logic.

## 5. SEO substance (§7 — binding)

Every one of the 19 slugs gets a bespoke `toolContent[slug]` entry (en + ar): unique intro paragraphs tied to the real use case + 3–5 FAQs; `related[]` cross-links per §7. No find-and-replace bodies — each page's copy must name its own scenario:
- compress-to-KB family: exam/government portal upload caps, email attachment limits, web performance budgets; each KB tier names the tier's real-world specs (e.g. 20 KB signature/photo fields on application portals, 100 KB job-portal caps, 200 KB CMS limits).
- signature page: 10–20 KB signature spec, dimension guidance, format advice.
- HEIC pages: iPhone default format, why uploads reject it, quality/compatibility tradeoffs; JPG vs PNG variant framing differs (photos vs screenshots/transparency).
- mic/webcam: pre-call check flows (Zoom/Meet/Teams), permission troubleshooting, privacy (no recording, on-device).
- testers/crop/watermark: real use cases (new keyboard QA, controller drift, monitor purchase check, ID-photo crop, photo copyright).
- Unique H1 per page = `ToolsConfig.tools.<slug>.name` ×9 (e.g. "Compress Image to 20 KB", "صغّط صورة إلى 20 كيلوبايت", …) — names must read naturally per locale, not transliterated English.

## 6. Locales (×9: en, ar, es, pt-BR, fr, de, ru, id, zh-CN)

1. `ToolsConfig.tools.<slug>.{name,description}` for all 19 slugs × 9 locales.
2. New/changed `Tools.*` strings: ImageCompression target-mode keys, ImageConverter HEIC keys, `Tools.CropImage`, `Tools.WatermarkImage`, `Tools.KeyboardTester`, `Tools.GamepadTester`, `Tools.DeadPixelTest` × 9 locales.
3. No orphaned keys (`scripts/prune-orphaned-i18n.mjs` clean).

## 7. Blog (en + ar)

Three posts × 2 locales, added to `blog-data.ts` + `src/app/blog/posts/`:
1. `compress-image-to-20kb-guide` (+`-ar`) — exam-upload size limits cluster anchor; links the KB family.
2. `heic-to-jpg-iphone-photos` (+`-ar`) — why iPhone photos won't upload.
3. `test-keyboard-gamepad-screen-online` (+`-ar`) — device tester pack intro.

## 8. Release checklist (roadmap §9)

README bullets for the 5 grid tools; `bun run validate` green; sitemap automatic via tools-config; `bun run e2e:routes` regenerated (19 new routes in smoke); all 19 slugs added to `HAS_OWN_H1`; popularity ranking: insert `heic-to-jpg`, `crop-image`, `watermark-image`, `keyboard-tester` into `TOOL_POPULARITY` tier 2 at sensible search-demand positions; marketing counts keep using `roundedToolCount()` (landing variants excluded). Launch action: sitemap ping post-merge + blog cluster (above).

## 9. Gates (per task and final)

`bun run test` · `bunx tsc --noEmit` · `bun run lint` (0 errors) · `bun run validate` · `CI=true bun run build` (webpack) · `CI=true bun run e2e:smoke` (exactly-one-h1 + zero console errors on all routes incl. the 19 new). Existing tests unmodified except reported invalidated assertions. Zero user-visible change to existing tools (ImageResizer tabs, ImageCompression default modes, MicCameraTester, ImageConverter defaults).

## 10. Out of scope

PDF anything (W2), benchmark games beyond the three testers (W3 skipped), wheel/solvers (W4), no slug renames, no server code, no new locales.
