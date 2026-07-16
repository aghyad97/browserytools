# Wave 1 — Instant Volume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a target-file-size image compressor engine, 14 programmatic SEO landing pages over existing engines, and 5 new standalone tools (crop, watermark, keyboard/gamepad/dead-pixel testers), fully localized ×9 with bespoke SEO copy and a 3-post blog cluster.

**Architecture:** A pure, encoder-injectable binary-search engine (`src/lib/image/target-size.ts`) powers a new "target" mode in ImageCompression; a new `landingFor` field on tools-config entries creates hidden-from-grid landing variants that inherit sitemap/metadata/e2e/SEO plumbing for free; existing components gain optional `slug`/`preset` props so one component serves many landing routes.

**Tech Stack:** Next.js 15 App Router (webpack builds only), React 18, TypeScript, next-intl (client-side locale switch), Vitest v4 + happy-dom, Playwright smoke, canvas APIs, heic2any, react-dropzone.

## Global Constraints

- Work in worktree `/Users/aghyad/dev/browserytools/.claude/worktrees/redesign`, branch `wave-1-instant-volume`. ALWAYS `cd` into the worktree in the same command or use `git -C` — shell cwd resets between calls.
- Design contract (binding): every new tool interior uses `ToolShell` + shared molecules (`OutputPanel`/`SettingsCard`/`OptionRow`/`SliderRow`/`StatStrip`/`ModePicker`/`TwoPane`) styled via `var(--bt-*)` tokens only; CSS modules with logical properties; works in light AND dark themes; RTL-safe. NO `text-gray-*`/`slate-*`/raw hex in tool components. NO single-edge borders/accent bars on cards, ever.
- Exactly one `<h1>` per page: ToolShell renders it; every new slug must be added to `HAS_OWN_H1` in `src/components/layout/tool-title.tsx`.
- i18n: components call `useTranslations("Tools.<Component>")`; page H1/sub come from `ToolsConfig.tools.<slug>.{name,description}`. `next-intl` `t()` requires literal string keys — use ternary/switch, never `t(variable)`.
- URL stability: no existing slug changes. Zero user-visible behavior change to existing tools.
- Conventional commits. NEVER add Co-Authored-By, AI-attribution footers, or session links. If 1Password commit signing fails twice, use `--no-gpg-sign`.
- Gates for EVERY task (run from the worktree): `bun run test` && `bunx tsc --noEmit` && `bun run lint` && `bun run validate` && `CI=true bun run build` && `CI=true bun run e2e:smoke`. All green before commit. (`build` is `next build --webpack`; never Turbopack.)
- Existing tests may not be modified; if an intentional markup change invalidates one, STOP and report it in your final message instead of changing it.
- File references below: `tools-config.ts` = `src/lib/tools-config.ts`; `en.json` = `messages/en.json` (one big JSON per locale in `messages/`).

---

### Task 1: Target-size compression engine

**Files:**
- Create: `src/lib/image/target-size.ts`
- Test: `src/__tests__/lib/target-size.test.ts`

**Interfaces:**
- Consumes: `canvasToBlob`, `drawToCanvas` from `src/lib/image/canvas.ts` (existing: `canvasToBlob(canvas, type?, quality?) => Promise<Blob|null>`, `drawToCanvas(img, w, h) => HTMLCanvasElement`).
- Produces (Task 4 relies on these exact names):

```ts
export type TargetSizeFormat = "image/jpeg" | "image/webp";

export interface TargetSizeRequest {
  source: HTMLImageElement | ImageBitmap;
  targetBytes: number;
  format: TargetSizeFormat;
  minWidth?: number; // dimension floor, default 160
  encode?: (canvas: HTMLCanvasElement, type: string, quality: number) => Promise<Blob | null>;
}

export interface TargetSizeResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;     // 0..1 quality actually used
  iterations: number;  // total encode calls
  hitTarget: boolean;  // false = best effort, target unreachable
}

export async function compressToTargetSize(req: TargetSizeRequest): Promise<TargetSizeResult>;
```

**Algorithm (implement exactly):**
1. Start at source natural dimensions (never upscale). `encode` defaults to `canvasToBlob`.
2. At current dimensions, binary-search quality in `[0.30, 0.95]`: encode at mid; if `blob.size > targetBytes` go lower half, else record candidate and go upper half. Max 7 probes per dimension pass. Accept early if size is within `[0.90 * targetBytes, targetBytes]`.
3. If even quality 0.30 exceeds target: scale both dimensions by `Math.sqrt(targetBytes / lowestSize)` (clamp scaled width to ≥ `minWidth`, keep aspect), redraw via `drawToCanvas`, repeat step 2. Max 3 dimension passes.
4. Track the best (largest) result that is ≤ target across all passes; if none is ≤ target after all passes, return the smallest result produced with `hitTarget: false`; else return best with `hitTarget: true`.
5. Throw `new Error("encode-failed")` if the encoder returns null on every probe of a pass.

**Steps:**
- [ ] Write failing tests in `src/__tests__/lib/target-size.test.ts` using a fake encoder — deterministic size model, no real canvas encoding needed. Provide a fake source (`{width, height}` cast) and stub `drawToCanvas`-compatible behavior by passing `encode` and asserting only on quality/dimension math. Size model: `size = pixels * quality * K` (monotonic). Cases: (a) converges within tolerance and `hitTarget:true`; (b) early-accept inside the −10% window; (c) target smaller than floor-quality full-dim output → dimension step-down occurs (assert result width < natural width, still ≥ minWidth); (d) absurdly small target (e.g. 10 bytes) → `hitTarget:false` and result is smallest probe; (e) never upscales (result width ≤ source width); (f) encoder always null → rejects with "encode-failed". NOTE: `document.createElement("canvas")` exists in happy-dom; drawing may need a mock — mock `@/lib/image/canvas`'s `drawToCanvas` with `vi.mock` to return a stub `{width, height}` object.
- [ ] Run `bun run test src/__tests__/lib/target-size.test.ts` — expect FAIL (module missing).
- [ ] Implement `src/lib/image/target-size.ts` per the algorithm above.
- [ ] Run the test file — PASS; then full gates.
- [ ] Commit: `feat(image): target-size compression engine (binary-search quality + dimension step-down)`

---

### Task 2: `landingFor` landing-variant infrastructure

**Files:**
- Modify: `src/lib/tools-config.ts` (Tool interface ~line 93; helpers ~lines 1584-1621)
- Modify: `src/components/landing/landing.tsx` (catalog source)
- Modify: `src/components/template/tool-shell.tsx` (related-tiles resolution)
- Modify: `scripts/validate-tools.js` (README exemption)
- Test: `src/__tests__/lib/tools-config-landing.test.ts`

**Interfaces:**
- Produces: `Tool.landingFor?: string` (canonical slug); `getCatalogTools()` — same shape as `getAllTools()` but excludes entries with `landingFor`; `roundedToolCount()` now counts catalog tools only. Related-tiles rules (Task 3 entries depend on this behavior).

**Behavior rules:**
1. `getAllTools()` unchanged (sitemap `src/app/sitemap.ts`, metadata, e2e generator keep full visibility).
2. New `getCatalogTools()` = `getAllTools().filter(t => !t.landingFor)`. `landing.tsx` grid and `roundedToolCount()` switch to it.
3. Related tiles in ToolShell: for a NORMAL tool, exclude landing variants from the pool. For a LANDING tool (its own slug has `landingFor`), related = the canonical tool first, then up to N sibling variants sharing the same `landingFor` (N = existing related count), preserving existing tile rendering.
4. `scripts/validate-tools.js`: entries whose config block contains `landingFor:` are exempt from the README-bullet requirement (both directions: not required in README, not flagged as missing).
5. Keep tools-config field order in future entries: `name`, `href`, `icon`, `available`, `description`, `order`, `creationDate`, then optionals (`onDevice`, `landingFor`) — `scripts/generate-tool-routes.mjs` regex depends on `name` → `href` → … `available` order.

**Steps:**
- [ ] Write failing tests: temporary fixture approach — since `tools` is a static export, test against a synthetic entry: add tests that (a) `getCatalogTools()` excludes any tool with `landingFor` (inject via a test-only helper is NOT possible — instead test the filter logic against `getAllTools()` output: assert `getCatalogTools().every(t => !t.landingFor)` and, once Task 3 lands entries, counts differ; for now assert function exists and equals filtered getAllTools); (b) `roundedToolCount()` floors catalog count to nearest 10.
- [ ] Run tests — FAIL (no `getCatalogTools`).
- [ ] Implement interface field + helpers in tools-config.ts; switch `landing.tsx` and `roundedToolCount()`; implement the related-pool rules in `tool-shell.tsx` (find where it resolves the related list from tools-config by slug/category; apply rules 3); patch `validate-tools.js` (locate the config-parsing regex/block loop, skip blocks containing `landingFor:`).
- [ ] Run tests — PASS; full gates.
- [ ] Commit: `feat(tools-config): landingFor landing-variant support (hidden from grid/count, family-aware related tiles)`

---

### Task 3: Registry seed — 19 config entries, README, HAS_OWN_H1, en names, popularity

**Files:**
- Modify: `src/lib/tools-config.ts` (imageTools ~line 116, mediaTools ~line 371, testsGames ~line 1522)
- Modify: `messages/en.json` (`ToolsConfig.tools`)
- Modify: `src/components/layout/tool-title.tsx` (`HAS_OWN_H1`, lines 32-207)
- Modify: `README.md` (Image Tools + Tests & Games category sections; 5 bullets)
- Modify: `src/lib/tool-popularity.ts`

**Interfaces:**
- Consumes: `landingFor` from Task 2.
- Produces: the 19 slugs resolvable via `findToolByHref` — later tasks' ToolShell usage depends on this.

**Exact entries** (icons from lucide-react, already the pattern; `creationDate: "2026-07-16"`, `available: true`, field order per Task 2 rule 5):

imageTools (grid tools): 
| slug | name | icon | order | description (en, also goes in en.json) |
|---|---|---|---|---|
| crop-image | Crop Image | CropIcon | 21 | Crop images online with aspect-ratio presets and precise drag handles. Export to JPG, PNG, or WebP. |
| watermark-image | Watermark Image | StampIcon | 22 | Add text or logo watermarks to photos — position, opacity, rotation, and tiling. All in your browser. |

imageTools (landing variants, `landingFor: "image-compression"`, orders 60-69):
| slug | name | description |
|---|---|---|
| compress-image-to-20kb | Compress Image to 20KB | Shrink any photo to 20 kilobytes or less for application forms and portals with strict size limits. |
| compress-image-to-50kb | Compress Image to 50KB | Reduce image file size to 50KB for exam portals, job applications, and email attachments. |
| compress-image-to-100kb | Compress Image to 100KB | Get any picture under 100KB while keeping it sharp — made for upload limits. |
| compress-image-to-200kb | Compress Image to 200KB | Compress photos to 200KB or less for CMS uploads, listings, and document portals. |
| compress-image-to-500kb | Compress Image to 500KB | Bring large photos under 500KB without visible quality loss. |
| compress-image-to-1mb | Compress Image to 1MB | Compress high-resolution photos to under 1MB for email, forms, and faster sharing. |
| compress-jpeg-to-50kb | Compress JPEG to 50KB | Reduce JPEG file size to 50KB with smart quality search, right in your browser. |
| compress-jpeg-to-100kb | Compress JPEG to 100KB | Compress JPG photos to 100KB for portals and websites that cap upload size. |
| compress-jpeg-to-200kb | Compress JPEG to 200KB | Shrink JPG images to 200KB while preserving detail. |
| compress-signature-20kb | Compress Signature to 20KB | Resize and compress your signature image to 10–20KB for online application forms. |

imageTools (landing variants, `landingFor: "image-converter"`, icon ImageIcon):
| heic-to-jpg | HEIC to JPG | Convert iPhone HEIC photos to JPG right in your browser — no upload, instant download. |
| heic-to-png | HEIC to PNG | Convert HEIC images to lossless PNG locally in your browser. |

mediaTools (landing variants, `landingFor: "mic-camera"`, icons MicIcon / VideoIcon):
| mic-test | Mic Test | Check your microphone in seconds with a live level meter — before the call, not during it. |
| webcam-test | Webcam Test | Preview your camera and check quality before a meeting. Nothing is recorded or uploaded. |

testsGames (grid tools):
| keyboard-tester | Keyboard Tester | KeyboardIcon | 2 | Test every key on your keyboard with a live visual layout, key history, and rollover check. |
| gamepad-tester | Gamepad Tester | Gamepad2Icon | 3 | Test controller buttons, sticks, triggers, and vibration for any USB or Bluetooth gamepad. |
| dead-pixel-test | Dead Pixel Test | MonitorIcon | 4 | Find dead or stuck pixels with fullscreen solid-color checks for any monitor or phone. |

**Steps:**
- [ ] Add the 19 entries to tools-config.ts in the categories above (landing variants use the icon of their canonical tool unless listed). Verify each landing entry includes `landingFor`.
- [ ] Add all 19 `ToolsConfig.tools.<slug>` `{name, description}` objects to en.json (copy name/description from the tables verbatim).
- [ ] Add all 19 slugs to `HAS_OWN_H1`.
- [ ] Add README bullets for the 5 grid tools only, matching `- **Tool Name**: description` format under the correct `###` category headers (Tests & Games section may need creating to match existing README structure — check how other categories are headed).
- [ ] Add to `TOOL_POPULARITY` tier 2 (search-demand section): `heic-to-jpg` right after `image-converter`; `crop-image` and `watermark-image` after `image-resizer`; `keyboard-tester` near the end of tier 2.
- [ ] Run `node -e` sanity: `getCatalogTools()` length = previous count + 5; `getAllTools()` + 19. Full gates (README/validate must pass; e2e routes JSON NOT regenerated yet — that's Task 12).
- [ ] Commit: `feat(tools): register wave-1 catalog — 5 tools + 14 landing variants (hidden from grid)`

---

### Task 4: ImageCompression — target mode + slug/preset props

**Files:**
- Modify: `src/components/ImageCompression.tsx` (mode state line ~62, quality derivation ~135-141, encode ~145, ToolShell usage ~190-216, settings card)
- Modify: `messages/en.json` (`Tools.ImageCompression`)
- Test: extend `src/__tests__/components/` with `ImageCompressionTarget.test.tsx` (do not modify existing ImageCompression tests)

**Interfaces:**
- Consumes: `compressToTargetSize`, `TargetSizeFormat` from Task 1; `loadImage` from `src/lib/image/canvas.ts`.
- Produces (Task 12 pages rely on this):

```ts
export interface ImageCompressionPreset {
  mode?: "auto" | "aggressive" | "custom" | "target";
  targetKb?: number;
  format?: string;        // "original" | "image/jpeg" | "image/webp" | "image/png"
  lockFormat?: boolean;
}
export default function ImageCompression(
  { slug = "image-compression", preset }: { slug?: string; preset?: ImageCompressionPreset } = {}
)
```

**Behavior:**
- `slug` feeds ToolShell (`slug={slug}`) and title/sub `tc(\`tools.${slug}.name\`)` — NOTE next-intl literal-key rule applies to `useTranslations` namespace access via `t()`; `tc` with a template string over `ToolsConfig` has precedent in the codebase (ImageCompression already does `tc("tools.image-compression.name")`) — follow the existing call style but with the dynamic slug: `tc(\`tools.${slug}.name\` as Parameters<typeof tc>[0])` if the typed key complains, matching any existing dynamic-key casts in the repo (search for `as Parameters` or check how ToolTitle does it: `tool-title.tsx` renders `tc(\`tools.${slug}.name\`)` — copy that approach).
- Initial state from `preset`: mode (default "auto"), targetKb (default 100, clamp 5..5120), format (default existing behavior), `lockFormat` hides the format OptionRow.
- New mode option "target" in the mode Select. When active: show a target-size row — numeric input (KB) + preset chips 20/50/100/200/500/1024 (chip labels "20 KB" … "1 MB") — hide quality + maxWidth controls.
- Target mode format: only WebP/JPEG selectable; if current selection is PNG/original, coerce to JPEG and show hint text `t("pngNotSupportedInTarget")`.
- Compress action in target mode: `loadImage(image.url)` → `compressToTargetSize({source, targetBytes: targetKb*1024, format})` → blob → object URL (or FileReader dataURL to fit existing state) → set compressed size from `blob.size`. Result panel additionally shows achieved dimensions + quality (`Math.round(q*100)`) and, when `hitTarget === false`, a visible notice `t("targetMissed")`.
- Existing auto/aggressive/custom paths byte-for-byte unchanged.

**New en.json `Tools.ImageCompression` keys:** `modeTarget: "Target size"`, `targetSize: "Target size (KB)"`, `targetSizeHint: "We search quality and dimensions to hit your target."`, `targetReached: "Target reached"`, `targetMissed: "Couldn't reach the exact target — this is the smallest achievable at acceptable quality."`, `pngNotSupportedInTarget: "PNG can't be size-targeted — switched to JPEG."`, `presetChipAria: "Set target to {label}"`.

**Steps:**
- [ ] Write failing component test `ImageCompressionTarget.test.tsx`: renders `<ImageCompression preset={{mode:"target", targetKb:20}} />` inside the repo's standard test providers (copy provider setup from an existing component test); asserts the target-size input shows 20, quality slider absent, chips present; `vi.mock("@/lib/image/target-size")` for the engine; simulate the flow far enough to assert the mock is called with `targetBytes: 20480` (drop a fake file via the existing test pattern for FileDropzone if present in other tests — check `src/__tests__/components/` for an ImageCompression/ImageConverter precedent and mirror its upload simulation; if none simulates upload, cover the preset/UI assertions only and leave engine-call coverage to a direct unit call).
- [ ] Run new test — FAIL.
- [ ] Implement per Behavior. Add en.json keys.
- [ ] New test PASS + existing ImageCompression tests untouched and green; full gates.
- [ ] Commit: `feat(image-compression): target-file-size mode + slug/preset props for landing variants`

---

### Task 5: ImageConverter — HEIC PNG-intermediate + slug/preset props

**Files:**
- Modify: `src/components/ImageConverter.tsx` (heic ingest ~line 74-77, formatOptions ~32, component signature)
- Modify: `messages/en.json` (`Tools.ImageConverter`)
- Test: `src/__tests__/components/ImageConverterPreset.test.tsx` (new)

**Interfaces:**
- Produces (Task 12 relies on):

```ts
export interface ImageConverterPreset {
  targetFormat?: string;   // "image/jpeg" | "image/png" | "image/webp" | "image/avif"
  lockFormat?: boolean;
  heicEmphasis?: boolean;  // dropzone copy leads with .heic
}
export default function ImageConverter(
  { slug = "image-converter", preset }: { slug?: string; preset?: ImageConverterPreset } = {}
)
```

**Behavior:**
- HEIC ingest: `heic2any({ blob: file, toType: "image/png" })` (was jpeg) — lossless intermediate; renamed `.heic` → `.png` internally; then the normal re-encode to `targetFormat` runs as today. Verify the downstream mismatch guard still passes for jpeg/webp/avif targets.
- `preset.targetFormat` sets initial format state; `lockFormat` hides the format OptionRow; `heicEmphasis` swaps dropzone subtitle to `t("heicDropHint")` and puts `.heic`/`.heif` first in the dropzone `accept`.
- `slug` → ToolShell identity, same pattern as Task 4.
- Default behavior (no props) unchanged except the PNG intermediate (strictly better quality; not user-visible UI change).

**New en.json `Tools.ImageConverter` keys:** `heicDropHint: "Drop iPhone HEIC photos here — converted locally, never uploaded."`.

**Steps:**
- [ ] Failing test: render `<ImageConverter preset={{targetFormat:"image/png", lockFormat:true, heicEmphasis:true}} />` with standard providers; assert format select hidden, heic hint text present. Mock `heic2any` module (`vi.mock("heic2any")`) and assert ingest called with `toType: "image/png"` when a fake `.heic` File is dropped (mirror existing upload-simulation pattern; if infeasible in happy-dom, assert props-driven UI only and unit-test the ingest branch by exporting the detection/ingest helper).
- [ ] Run — FAIL. Implement. PASS. Full gates.
- [ ] Commit: `feat(image-converter): lossless HEIC ingest + preset/slug props for HEIC landing pages`

---

### Task 6: Mic/Webcam split — panels + MicTester/WebcamTester

**Files:**
- Create: `src/components/media-tester/useMediaDevices.ts`, `src/components/media-tester/MicTesterPanel.tsx`, `src/components/media-tester/WebcamTesterPanel.tsx`
- Modify: `src/components/MicCameraTester.tsx` (becomes composition of both panels, ~234 lines today)
- Create: `src/components/MicTester.tsx`, `src/components/WebcamTester.tsx`
- Test: `src/__tests__/components/MediaTesterSplit.test.tsx`

**Interfaces:**
- Produces: `MicTester()` and `WebcamTester()` default-export components (no props) rendering ToolShell with slugs `mic-test` / `webcam-test` (config entries exist from Task 3).
- Panels: `MicTesterPanel({ t })` style is WRONG — panels call `useTranslations("Tools.MicCameraTester")` themselves (strings already exist ×9; do NOT create new namespaces for the panels).

**Behavior:**
- Extract from MicCameraTester: device enumeration (`listDevices` line ~40, `devicechange` listener) into `useMediaDevices()` hook returning `{ cameras, mics, refresh }`; mic path (mic select + `getUserMedia` audio + AnalyserNode metering + level bar) into `MicTesterPanel`; camera path (camera select + video preview) into `WebcamTesterPanel`. Teardown (`stopCurrent`) stays per-panel — each panel manages its own stream lifecycle.
- `/tools/mic-camera` renders both panels side by side exactly as today (visual + behavior parity — same SettingsCard/OptionRow structure).
- `MicTester` = ToolShell(slug "mic-test") + `MicTesterPanel` only; `WebcamTester` = ToolShell(slug "webcam-test") + `WebcamTesterPanel` only.

**Steps:**
- [ ] Failing test: mock `navigator.mediaDevices` (`enumerateDevices` resolving a fake mic+camera list, `getUserMedia` resolving a stub stream with stop-able tracks, `addEventListener`); render `<MicTester />` — assert mic select present and NO video element; render `<WebcamTester />` — assert video element present and no level meter; render `<MicCameraTester />` — assert both. (AudioContext mock: reuse/extend the pattern in existing AudioTranscriber tests if present in `src/test-setup.ts`.)
- [ ] Run — FAIL. Implement extraction. PASS; existing MicCameraTester tests (if any) green; full gates.
- [ ] Commit: `refactor(mic-camera): split into panels; add MicTester + WebcamTester landing components`

---

### Task 7: Crop extraction + CropImage tool

**Files:**
- Create: `src/lib/image/crop-rect.ts` (pure math), `src/components/CropImage.tsx`
- Modify: `src/components/ImageResizer.tsx` (crop tab consumes the extracted math; UI stays in place)
- Modify: `messages/en.json` (`Tools.CropImage`)
- Test: `src/__tests__/lib/crop-rect.test.ts`, `src/__tests__/components/CropImage.test.tsx`

**Interfaces:**
- Produces in `crop-rect.ts` (extracted from ImageResizer lines ~50, ~86, ~107, ~283-357):

```ts
export interface CropRect { x: number; y: number; w: number; h: number } // normalized 0..1
export const ASPECT_PRESETS: { id: string; ratio: number | null }[];      // free,1:1,4:3,3:4,16:9,9:16
export function clamp(v: number, min: number, max: number): number;
export function fitRectToAspect(rect: CropRect, aspect: number | null, imgW: number, imgH: number): CropRect;
export function moveRect(rect: CropRect, dx: number, dy: number): CropRect;
export function resizeRect(rect: CropRect, dx: number, dy: number, aspect: number | null, imgW: number, imgH: number): CropRect;
export function rectToSourcePixels(rect: CropRect, naturalW: number, naturalH: number): { sx: number; sy: number; sw: number; sh: number };
```

Port the EXACT math from ImageResizer's `applyAspect`/`onCropPointerMove`/`runCrop` — behavior parity is the requirement, signatures above are the refactor.

**CropImage component:** ToolShell(slug "crop-image", default export, no props) + FileDropzone → interactive crop overlay (same pointer-event pattern/data-testids as ImageResizer: `crop-area`, `crop-box`, `crop-handle`) + aspect preset buttons + export controls (format jpeg/png/webp + quality SliderRow) → `canvasToBlob` → download via `downloadUrl`, filename `${base}_cropped.${ext}`. StatStrip: original dims → cropped dims + output size. `Tools.CropImage` en keys as needed (aspect labels can mirror `Tools.ImageResizer` wording but live under `Tools.CropImage`).

**Steps:**
- [ ] Failing unit tests for `crop-rect.ts` math: aspect re-fit keeps center & respects bounds; move clamps at edges; resize honors aspect lock; `rectToSourcePixels` maps `{0.1,0.1,0.8,0.8}` on 1000×500 → `{sx:100, sy:50, sw:800, sh:400}`.
- [ ] Run — FAIL. Extract math from ImageResizer into `crop-rect.ts`; rewire ImageResizer's crop tab to import it (no UI/behavior change); build `CropImage`.
- [ ] Component test: render, drop fake image (mirror repo's image-upload test pattern), assert crop overlay + aspect buttons render; math already unit-covered.
- [ ] PASS; existing ImageResizer tests green; full gates.
- [ ] Commit: `feat(tools): standalone Crop Image tool; crop math extracted and shared with ImageResizer`

---

### Task 8: Watermark extraction + WatermarkImage tool

**Files:**
- Create: `src/lib/image/watermark-draw.ts`, `src/components/WatermarkImage.tsx`
- Modify: `src/components/ImageResizer.tsx` (watermark tab consumes extracted draw)
- Modify: `messages/en.json` (`Tools.WatermarkImage`)
- Test: `src/__tests__/lib/watermark-draw.test.ts`, `src/__tests__/components/WatermarkImage.test.tsx`

**Interfaces:**
- Produces in `watermark-draw.ts` (extracted from ImageResizer lines ~57-105, ~400, ~418+):

```ts
export type WatermarkKind = "text" | "image";
export type Anchor = "top-left" | "top" | "top-right" | "left" | "center" | "right" | "bottom-left" | "bottom" | "bottom-right";
export const ANCHORS: Anchor[];
export interface WatermarkOptions {
  kind: WatermarkKind; text: string; fontSize: number; color: string;
  opacity: number;        // 0..100
  anchor: Anchor; scale: number; rotation: number; tile: boolean;
  image?: HTMLImageElement | null;
}
export function anchorPosition(anchor: Anchor, cw: number, ch: number, iw: number, ih: number): { x: number; y: number }; // 3% padding, exact port
export function drawWatermark(ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number, opts: WatermarkOptions): void;
```

**WatermarkImage component:** ToolShell(slug "watermark-image") + FileDropzone → controls (ModePicker text/image, text/font-size/color inputs, 3×3 anchor grid with `data-testid="anchor-*"`, SliderRows opacity/scale/rotation, tile toggle — mirroring ImageResizer's watermark tab structure) → draw base + `drawWatermark` → export (format+quality) → download `${base}_watermarked.${ext}`.

**Steps:**
- [ ] Failing unit tests for `anchorPosition` (all 9 anchors on 1000×1000 canvas with 100×100 mark, 3% padding: e.g. bottom-right → `{x: 870, y: 870}`, center → `{x: 450, y: 450}`) and a `drawWatermark` smoke with a mocked ctx (records calls; assert `globalAlpha` set to `opacity/100`, rotate called when rotation ≠ 0, multiple draw calls when `tile: true`).
- [ ] Run — FAIL. Extract; rewire ImageResizer watermark tab; build WatermarkImage.
- [ ] Component test: renders controls, anchor grid, sliders after fake image drop.
- [ ] PASS; ImageResizer tests green; full gates.
- [ ] Commit: `feat(tools): standalone Watermark Image tool; watermark draw extracted and shared with ImageResizer`

---

### Task 9: KeyboardTester

**Files:**
- Create: `src/components/KeyboardTester.tsx` (+ `KeyboardTester.module.css` if needed)
- Modify: `messages/en.json` (`Tools.KeyboardTester`)
- Test: `src/__tests__/components/KeyboardTester.test.tsx`

**Behavior:**
- ToolShell(slug "keyboard-tester", width "wide"). Visual ANSI-104 layout (rows of keys, flex/grid; key caps show labels; `event.code` is the identity — e.g. `KeyA`, `Space`, `Numpad1`).
- Window `keydown`/`keyup` listeners (attached on mount, removed on unmount): key currently held → pressed style (bt accent); ever-pressed → tested style (bt fill-hover tint). `preventDefault()` on keydown for `Space`, `Tab`, `Alt*`, `F1`-`F12` while the page is active so the browser doesn't scroll/focus-trap.
- StatStrip: keys tested count / total, current rollover (simultaneously held count), max rollover seen. History line of last ~15 codes. Reset button clears all.
- i18n keys: `pressAnyKey`, `keysTested`, `rollover`, `maxRollover`, `history`, `reset` (+ whatever the layout needs; key cap labels themselves are NOT translated — they're physical key legends).
- No raw hex/gray classes; both themes; RTL: keyboard stays LTR (`dir="ltr"` on the board — physical layout), surrounding UI logical.

**Steps:**
- [ ] Failing test: render; `fireEvent.keyDown(window, {code:"KeyA"})` → the KeyA cap gets pressed state (assert via `data-code="KeyA"` attr + class or `data-pressed`); keyUp → moves to tested state; StatStrip count increments; two held keys → rollover 2; reset clears.
- [ ] Run — FAIL. Implement. PASS. Full gates.
- [ ] Commit: `feat(tools): keyboard tester — visual layout, rollover, key history`

---

### Task 10: GamepadTester

**Files:**
- Create: `src/components/GamepadTester.tsx`
- Modify: `messages/en.json` (`Tools.GamepadTester`)
- Test: `src/__tests__/components/GamepadTester.test.tsx`

**Behavior:**
- ToolShell(slug "gamepad-tester"). Empty state card: "Connect a controller and press any button" (`t("connectPrompt")`).
- On `gamepadconnected` start a rAF loop polling `navigator.getGamepads()`; on `gamepaddisconnected` with zero pads, stop the loop (and cancel on unmount).
- Per pad: id string, mapping; buttons rendered as a grid of indexed tiles (pressed → accent fill, analog `value` as a fill bar); axes as pairs → stick visualizers (dot position in a circle) + raw values (4 decimals) for drift checking.
- Vibration: if `pad.vibrationActuator?.playEffect` exists, a "Test vibration" button (`dual-rumble`, 500ms, 0.8/0.4).
- i18n keys: `connectPrompt`, `buttons`, `axes`, `vibrationTest`, `mapping`, `connected`, `disconnected`.

**Steps:**
- [ ] Failing test: mock `navigator.getGamepads` returning one fake pad (`{id:"Test Pad", index:0, connected:true, mapping:"standard", buttons:[{pressed:true,value:1},{pressed:false,value:0}], axes:[0.5,-0.5], vibrationActuator:{playEffect:vi.fn()}}`); dispatch `new Event("gamepadconnected")` (attach `gamepad` prop via `Object.defineProperty`); mock rAF to run once (`vi.spyOn(window,"requestAnimationFrame")` immediate-invoke-once pattern with a guard); assert pad id shown, button 0 pressed state, axes values rendered; click vibration button → `playEffect` called.
- [ ] Run — FAIL. Implement. PASS. Full gates.
- [ ] Commit: `feat(tools): gamepad tester — buttons, axes/drift, vibration`

---

### Task 11: DeadPixelTest

**Files:**
- Create: `src/components/DeadPixelTest.tsx`
- Modify: `messages/en.json` (`Tools.DeadPixelTest`)
- Test: `src/__tests__/components/DeadPixelTest.test.tsx`

**Behavior:**
- ToolShell(slug "dead-pixel-test"). Instructions SettingsCard: what dead vs stuck pixels look like, cycle instructions (`t("instructions*")` keys). Color swatch row previewing the cycle: `#ffffff, #000000, #ff0000, #00ff00, #0000ff` + custom color input. (These hexes are CONTENT — the test colors themselves — allowlisted per the R3 contract, same class as color-picker swatch data.)
- "Start test" primary action → `containerRef.current.requestFullscreen()` (pattern: `src/components/Timer.tsx:130`) on a fixed overlay div filling the screen with the current color; click / ArrowRight advances color, ArrowLeft back, Esc exits (native fullscreen exit; also handle `fullscreenchange` to reset state). Small fading hint overlay ("click to change color — Esc to exit") that disappears after 3s.
- i18n keys: `start`, `instructionsTitle`, `instructionsDead`, `instructionsStuck`, `instructionsHowTo`, `hintOverlay`, `customColor`.

**Steps:**
- [ ] Failing test: mock `HTMLElement.prototype.requestFullscreen = vi.fn().mockResolvedValue(undefined)`; render; click start → requestFullscreen called and overlay visible with white background; simulate click on overlay → background becomes black (assert inline style); ArrowRight → red; `document.dispatchEvent(new Event("fullscreenchange"))` with `document.fullscreenElement` null (defineProperty) → overlay hidden.
- [ ] Run — FAIL. Implement. PASS. Full gates.
- [ ] Commit: `feat(tools): dead pixel test — fullscreen color cycler`

---

### Task 12: Routes — 19 pages + og images + e2e route regen

**Files:**
- Create per slug S in the 19 (Task 3 tables): `src/app/tools/S/page.tsx`, `src/app/tools/S/opengraph-image.tsx`, `src/app/tools/S/twitter-image.tsx`
- Modify: `e2e/tool-routes.json` (via generator)

**Interfaces:** Consumes component props from Tasks 4-11.

**page.tsx template** (exact shape; swap component/slug/preset per row):

```tsx
import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/compress-image-to-20kb");
export default function Page() {
  return <ImageCompression slug="compress-image-to-20kb" preset={{ mode: "target", targetKb: 20 }} />;
}
```

**Per-slug component/preset map:**
| slug | component | props |
|---|---|---|
| compress-image-to-20kb | ImageCompression | `slug`, `preset={{mode:"target", targetKb:20}}` |
| compress-image-to-50kb | ImageCompression | targetKb 50 |
| compress-image-to-100kb | ImageCompression | targetKb 100 |
| compress-image-to-200kb | ImageCompression | targetKb 200 |
| compress-image-to-500kb | ImageCompression | targetKb 500 |
| compress-image-to-1mb | ImageCompression | targetKb 1024 |
| compress-jpeg-to-50kb | ImageCompression | targetKb 50, `format:"image/jpeg"`, `lockFormat:true` |
| compress-jpeg-to-100kb | ImageCompression | targetKb 100, jpeg, lockFormat |
| compress-jpeg-to-200kb | ImageCompression | targetKb 200, jpeg, lockFormat |
| compress-signature-20kb | ImageCompression | targetKb 20, jpeg, lockFormat |
| heic-to-jpg | ImageConverter | `preset={{targetFormat:"image/jpeg", lockFormat:true, heicEmphasis:true}}` |
| heic-to-png | ImageConverter | `preset={{targetFormat:"image/png", lockFormat:true, heicEmphasis:true}}` |
| mic-test | MicTester | none |
| webcam-test | WebcamTester | none |
| crop-image | CropImage | none |
| watermark-image | WatermarkImage | none |
| keyboard-tester | KeyboardTester | none |
| gamepad-tester | GamepadTester | none |
| dead-pixel-test | DeadPixelTest | none |

**og/twitter image template** (exact, swap slug):

```tsx
import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";
export const alt = "compress-image-to-20kb | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;
export default function Image() {
  return generateToolOgImage("compress-image-to-20kb");
}
```

**Steps:**
- [ ] Generate the 57 files (script them via a small bash/node loop or write directly — content is fully templated above).
- [ ] `bun run e2e:routes` — verify `e2e/tool-routes.json` gained exactly 19 entries (156 total).
- [ ] Full gates INCLUDING `CI=true bun run build` (all 19 routes must build) and `CI=true bun run e2e:smoke` (all new routes: <400, exactly one h1, zero console errors). Fix anything that surfaces (typical: double h1 from missing HAS_OWN_H1 — Task 3 covered it; MISSING_MESSAGE from locale gaps — Task 3 covered en).
- [ ] Commit: `feat(routes): 19 wave-1 routes wired (pages + og images) and smoke-covered`

---

### Task 13: Bespoke SEO content (en + ar) for all 19 slugs

**Files:**
- Modify: `src/lib/tool-content.ts` (the `toolContent: Record<slug, {en, ar, related}>` registry; `ToolContentLocale = { intro: string | string[]; faq: {q,a}[]; steps?: string[] }` — check the exact type at the top of the file and conform)

**Requirements (roadmap §7 — REJECTION CRITERIA for this task):**
- Every entry: unique intro (2-3 paragraphs), 4-5 FAQ pairs, 3-4 steps, `related[]` links.
- NO find-and-replace bodies: each KB tier must name its own real-world scenario. Required anchors: 20kb → signature/photo fields on government & exam application portals (e.g. passport-photo signature fields commonly capped at 10–20 KB); 50kb → exam portal photo uploads, compact email signatures; 100kb → job portals/ATS caps, forum avatars; 200kb → CMS/marketplace listing limits; 500kb → email attachment etiquette, web hero images; 1mb → email providers' practical limits, chat apps. JPEG variants: additionally explain JPEG-specific behavior (artifacts, why re-saving JPEG loses quality). Signature page: 10–20 KB band, dimension advice (~140×60), dark-ink-on-white tips.
- heic-to-jpg: iPhones shoot HEIC by default since iOS 11, portals/Windows apps reject it, quality tradeoff honest. heic-to-png: screenshots/transparency/lossless framing — must NOT read like the jpg page.
- mic-test: pre-call check (Zoom/Meet/Teams), permission troubleshooting per browser, explicit privacy (audio never leaves device, no recording). webcam-test: same for camera.
- crop-image (ID photos, social crops), watermark-image (copyright, batch expectations honest — single image), keyboard-tester (new keyboard QA, debounce/chatter, NKRO), gamepad-tester (stick drift diagnosis), dead-pixel-test (dead vs stuck, new monitor check, fix attempts honest).
- `related`: each compress page links 2-3 KB siblings + `image-compression` + `image-resizer`; heic pages link each other + `image-converter`; mic/webcam link each other + `mic-camera`; testers link each other; crop/watermark link each other + `image-resizer`.
- Arabic: native transcreation, not literal translation (RTL-natural phrasing, real Arabic web vocabulary). Same substance rules.
- No fabricated statistics, no invented portal names with specific limits you aren't sure of — describe categories of portals generically rather than naming a specific requirement you can't verify.

**Steps:**
- [ ] Read `tool-content.ts` header types + the existing `compress-video` bespoke entry as the shape/tone reference.
- [ ] Write all 19 entries (en + ar + related).
- [ ] `bun run test` (tool-content has type safety via tsc) + full gates.
- [ ] Commit: `feat(seo): bespoke intro/FAQ/steps content for all 19 wave-1 pages (en+ar)`

---

### Task 14: Locale volume — 8 remaining locales

**Files:**
- Modify: `messages/ar.json`, `messages/es.json`, `messages/pt-BR.json`, `messages/fr.json`, `messages/de.json`, `messages/ru.json`, `messages/id.json`, `messages/zh-CN.json`

**Scope per locale file:**
1. `ToolsConfig.tools.<slug>.{name,description}` for all 19 slugs — names must read naturally in the locale (e.g. ar: "ضغط الصورة إلى 20 كيلوبايت"; de: "Bild auf 20 KB komprimieren"), descriptions transcreated from the Task 3 en table.
2. New `Tools.*` keys added in Tasks 4-11: `Tools.ImageCompression` (7 keys from Task 4), `Tools.ImageConverter` (1 key from Task 5), full new namespaces `Tools.CropImage`, `Tools.WatermarkImage`, `Tools.KeyboardTester`, `Tools.GamepadTester`, `Tools.DeadPixelTest` — key lists must exactly match what landed in en.json (diff en.json against main to enumerate: `git diff main -- messages/en.json`).

**Execution note for the coordinator:** fan out one Sonnet subagent per locale file (8 parallel — disjoint files, no conflicts). Each agent gets: the en.json diff (exact keys+values), the Task 3 name/description table, locale-specific style guidance (ar = transcreation per arabic-localizer standards; zh-CN simplified; pt-BR not pt-PT).

**Steps (per locale agent):**
- [ ] Extract the exact new-key set from `git diff main -- messages/en.json`.
- [ ] Add all keys to `<locale>.json` in the same JSON paths, translated (JSON stays valid — verify with `node -e "JSON.parse(require('fs').readFileSync('messages/<locale>.json','utf8'))"`).
- [ ] Coordinator after all 8: `bun run test && bunx tsc --noEmit` + spot-check `node scripts/prune-orphaned-i18n.mjs --check` if the script supports check mode (read its header; if it only prunes, run it and verify no diff), then full gates.
- [ ] Commit (single): `feat(i18n): wave-1 strings across all 9 locales`

---

### Task 15: Blog cluster (3 posts × en + ar)

**Files:**
- Create: `src/app/blog/posts/compress-image-to-20kb-guide.tsx`, `.../compress-image-to-20kb-guide-ar.tsx`, `.../heic-to-jpg-iphone-photos.tsx`, `.../heic-to-jpg-iphone-photos-ar.tsx`, `.../test-keyboard-gamepad-screen-online.tsx`, `.../test-keyboard-gamepad-screen-online-ar.tsx`
- Modify: `src/lib/blog-data.ts` (`basePosts` array — en + ar entries, `date: "2026-07-16"`, sensible `category`/`tags`/`readTime`/`coverEmoji`/`coverGradient` matching existing entries' style)

**Content requirements:**
- Each post 800-1200 words, `export default function Content()` returning JSX (`<p>/<h2>/<ul>` inside plain `<div>`, prose-rendered — copy the structure of a recent existing post, e.g. a 2026-06 one).
- Post 1 (anchor): why forms cap uploads at 20-100 KB, how target-size compression works (quality search + dimension step-down, honest about tradeoffs), walkthrough using `/tools/compress-image-to-20kb`, links to ALL compress-family pages + signature page.
- Post 2: HEIC explained, why uploads fail, convert walkthrough (`/tools/heic-to-jpg`, `/tools/heic-to-png`), privacy angle (on-device), when to keep HEIC.
- Post 3: device tester roundup — keyboard (chatter/NKRO), gamepad (drift), dead pixel (dead vs stuck), mic/webcam pre-call checks; links to all five pages.
- Arabic versions: transcreations with Arabic slugs following the existing `-ar` convention (slug in blog-data can be Arabic-transliterated like existing ar posts — mirror `ibqa-aljihaz-mustayqizan-ar` style: pick natural Arabic-Latin slugs ending `-ar`).
- No fake stats; internal links use plain `<a href="/tools/...">`or the pattern existing posts use (check one).

**Steps:**
- [ ] Read one recent en post + one ar post for structure/conventions; read `blog-data.ts` entry shape.
- [ ] Write 6 post files + 6 blog-data entries.
- [ ] Full gates (build renders blog statically — errors surface here); verify posts at `/blog/<slug>` in the smoke-adjacent sense (build success + sitemap includes them automatically via blogPosts).
- [ ] Commit: `feat(blog): wave-1 cluster — compress-to-KB, HEIC, device testers (en+ar)`

---

### Task 16: Final wave review + PR

**Steps:**
- [ ] `git diff main --stat` review pass: no unintended files (no `.playwright-mcp/`, `.shots/`, scratch files); no AI footers anywhere; conventional commit history.
- [ ] Run the complete gate suite one final time from a clean state: `bun run test && bunx tsc --noEmit && bun run lint && bun run validate && CI=true bun run build && CI=true bun run e2e:smoke`.
- [ ] Manual smoke (playwright MCP or dev server): `/tools/compress-image-to-20kb` (target mode preselected, chips visible), `/tools/heic-to-jpg` (format locked), `/tools/keyboard-tester` (keys light up), `/tools/dead-pixel-test`, `/tools/crop-image`, `/tools/mic-test` — light + dark theme, one RTL (ar) spot-check, mobile viewport on 2 pages.
- [ ] Verify homepage grid: 5 new tools visible, 14 landing variants NOT visible, tool count marketing string unchanged semantics (roundedToolCount).
- [ ] Push branch; open PR against `main`: title `feat: Wave 1 — target-size compression, 14 SEO landing pages, 5 new tools`, body = summary of the 19 routes + engine + infra + locales + blog, test plan = the gate list. NO AI attribution.
- [ ] Report PR URL.

---

## Self-review notes

- Spec §2 engine → Task 1. §3.1 → Task 4. §3.2 → Task 5. §3.3 → Task 6. §3.4 → Tasks 7-8. §3.5 → Tasks 9-11. §4 infra → Task 2. §1 inventory + §8 checklist (config/README/H1/popularity) → Task 3; routes/e2e → Task 12. §5 SEO substance → Task 13. §6 locales → Tasks 3 (en) + 14 (×8). §7 blog → Task 15. §9 gates → global constraints + Task 16.
- Type consistency: `ImageCompressionPreset`/`ImageConverterPreset` defined in Tasks 4/5, consumed verbatim in Task 12 map. `compressToTargetSize` signature defined Task 1, consumed Task 4. `landingFor`/`getCatalogTools` defined Task 2, consumed Tasks 3/12.
- Sequencing: 1→2→3 strictly ordered; 4-11 sequential (shared `messages/en.json` edits — do not parallelize in one worktree); 12 after all components; 13/15 independent after 12; 14 fans out per-locale (disjoint files) after 4-11 have landed all en keys.
