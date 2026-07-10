# BrowseryTools — Catalog Audit & Wave Roadmap

**Date:** 2026-07-10
**Status:** Draft for review
**Goal:** Grow from ~6k visitors/month to ~10k visitors/day (~300k/month) with a ranked portfolio of new and upgraded client-side tools, while paying down catalog debt that would otherwise scale into reputation damage.

---

## 1. Objectives & success criteria

Three success dimensions, in a ranked portfolio (per 2026-07-10 decision):

1. **Traffic** — rank for monster queries and own long-tail query families via programmatic pages.
2. **Retention** — app-scale destination tools people bookmark (subtitle studio, benchmark suite, teacher pack).
3. **Revenue** — natural paid hooks ($5 unlocks, invoice studio, API waitlist validation from the 2026-07-06 monetization discussion).

Success signals per wave: indexed pages count, ranking movement on target queries, returning-visitor share, first revenue events.

## 2. Constraints

- **100% client-side.** No servers, no uploads. This is the brand and the zero-COGS moat. Any design that requires a backend is out of scope.
- **1–2 week waves**, shipped sequentially with review between waves.
- **9 locales** (en, ar, es, pt-BR, fr, de, ru, id, zh-CN). Every tool needs `Tools.<Component>` + `ToolsConfig.tools.<slug>` entries in ALL locale files (missing entries throw `MISSING_MESSAGE` at render).
- **URL stability.** Existing slugs are SEO assets; category reorganization is display-only, no slug changes, no redirects needed.
- **New-tool checklist** (existing repo convention): locale entries ×9, README entry (`validate-tools.js` enforces sync), sitemap, blog post(s).
- **No gray-area tools** (YouTube/social downloaders): legal exposure not worth the traffic.

## 3. Audit findings (2026-07-10, 4 component-level reports over 137 tools)

### 3.1 Broken in code (P0 — actively damages trust)

| Tool | Reality |
| --- | --- |
| Audio Editor (`/tools/audio`) | Fade/echo/trim controls write to Zustand state nothing reads. Export replays the **untouched original** buffer — user trims, downloads, gets original file silently. Merge and format conversion absent entirely. Only volume + playback speed work, and only live, not in export. |
| Video Editor (`/tools/video`) | "Convert" is a canvas re-record via `MediaRecorder`, not a transcode. MP4 output frequently unsupported on Chromium (silent failure). No quality/bitrate control despite copy claiming it. Trim works (crude 30fps canvas re-render). Video→GIF works (gif.js). |

### 3.2 Overclaiming descriptions (P0 — copy promises features that don't exist)

| Tool | Claims | Actually implemented |
| --- | --- | --- |
| PDF Tools (`/tools/pdf`) | merge, split, **compress, extract text, rotate, watermark** | images→PDF, merge, split only; rotate is preview-only, never saved |
| Zip Tools (`/tools/zip`) | **password protection/encryption** | none — plain JSZip create/extract |
| Spreadsheet Viewer (`/tools/spreadsheet`) | view and **edit** | view-only (sort, filter, chart, CSV export); first Excel sheet only |
| File Converter (`/tools/file-converter`) | convert **documents, images, audio, video** | paste-only CSV/TSV/JSON/XML/YAML text converter; no file upload at all; flat tabular data only |

### 3.3 Duplicated engines (P1 — consolidate before waves multiply usage)

- **gif.js encode ×3**: VideoEditor, ScreenRecorder, GifMaker — three independent implementations, divergent options, same worker.
- **Image canvas plumbing**: `canvasToBlob` copy-pasted in ImageConverter + ImageResizer; ImageCompression uses its own `toDataURL` path; three different `ImageInfo` shapes; zero shared business logic across the image tools.
- **Timer plumbing**: `formatTime` + Web Audio beep reimplemented ×3 (Timer, Stopwatch, Pomodoro). Timer's stopwatch tab is a lesser duplicate of the dedicated Stopwatch.
- **Diff tools**: Text Diff uses a naive positional diff (misaligns on insert/delete); AI Instruction Diff uses the correct LCS `diff` package. Same intent, one buggy.

### 3.4 Non-duplicates (keep both, fix naming/placement)

- **Speech to Text** (live mic, Web Speech API, cloud-backed) vs **Audio/Video Transcriber** (on-device Whisper, file upload, SRT/VTT). Complementary engines and modalities; the problem is that names don't communicate which to use.
- **Text Similarity** (TF-IDF score) is distinct from the diff tools.

### 3.5 Confirmed assets (reuse targets)

| Asset | Where | Unlocks |
| --- | --- | --- |
| ffmpeg.wasm (real CRF transcode) | CompressVideo | audio cutter, real video convert, subtitle burn-in |
| Whisper via `hf-pipeline.ts` (WebGPU→WASM) | AudioTranscriber | Subtitle Studio |
| HEIC decode (`heic2any`) | ImageConverter | HEIC→JPG landing pages (no new engine) |
| AVIF encode (`@jsquash/avif`) | ImageConverter | converter matrix pages |
| Self-hosted tesseract.js (5 langs) | ImageToText | OCR upgrade path |
| pdf-lib + pdf.js + JSZip | PDFTools | PDF Workbench |
| Signature draw/type UI | SignatureMaker | Sign PDF (needs pdf-lib placement step) |
| Crop + watermark implementations | ImageResizer (1165-line, 3-tools-in-one) | standalone crop / watermark landing pages |

### 3.6 Confirmed gaps (greenfield)

- No target-file-size-in-KB compression anywhere (no iterative/binary-search encoder loop).
- No PDF: compress, persisted rotate, page reorder, watermark, sign, text extraction.
- No spinning-wheel picker (RandomPicker is tabs + CSS pulse).
- Typing Test: single fixed test, no duration modes, no share/save.
- Device testers: only mic + camera exist (no keyboard, gamepad, dead-pixel).

## 4. Phase 0 — "Make the catalog honest" (Week 1)

Ships before any new tool. Mostly delegable to subagents.

### 4.1 Honesty fixes

- **Audio Editor**: remove no-op controls (fade, echo, trim selection, merge/convert claims) from UI and description. Keep working volume/speed playback. Full rebuild arrives in Wave 6. Shipping less beats shipping lies.
- **Video Editor**: route convert through the existing ffmpeg.wasm engine (reuse CompressVideo's loader via the Phase 0 singleton). Fallback only if that exceeds ~1 day: relabel the tab to what it does ("re-record to WebM"). Either way remove the "adjust quality" claim; keep trim + GIF.
- **Descriptions**: rewrite PDF Tools, Zip Tools, Spreadsheet Viewer copy to match implemented features (in all 9 locales).
- **File Converter**: rename to **Data Format Converter** (name + copy; slug stays `/tools/file-converter` for URL stability).
- **Diff merge**: both diff pages render one shared component on the LCS `diff` engine (two presets/framings; both URLs stay for SEO).

### 4.2 Shared engines (foundations for waves)

- `src/lib/media/gif-encode.ts` — one gif.js wrapper; VideoEditor, ScreenRecorder, GifMaker migrate to it.
- `src/lib/image/canvas.ts` — `loadImage`, `canvasToBlob`, download helper, one `ImageInfo` type; the three image tools migrate.
- `src/lib/media/ffmpeg.ts` — singleton ffmpeg.wasm loader modeled on `hf-pipeline.ts` (dynamic import, cached instance, progress callback); CompressVideo migrates.
- `src/lib/time-format.ts` — shared `formatTime` + beep; timers migrate. Remove Timer's redundant stopwatch tab.

### 4.3 Category reorganization (display-only, no slug changes)

| Change | Detail |
| --- | --- |
| Formatters → Developer Tools | Code Formatter, HTML Formatter join CSS Minifier, SQL Formatter, JSON Formatter |
| Color suite → Design Tools | Image Color Picker, Color Blindness Simulator join palette/converter/contrast (Color Correction stays in Image — it edits photos) |
| Encoders → Data Tools | one "encode/decode" home: Base64, URL Encoder, Text to Binary, Morse Code (Hash/Encryption stay in Security) |
| New: **Tests & Games** | Typing Test moves in; Wave 3 benchmark suite lands here |
| New: **School & Learning** | Periodic Table moves in (out of Math & Finance); Wave 4 teacher pack lands here |
| New: **Business** | Invoice Generator + Expense Tracker move in; invoice studio & CSV cleaner land here |
| Transcription naming | "Speech to Text" → "Live Dictation (mic)"; transcriber keeps name; cross-link the two pages |

Acceptance: `validate-tools.js` passes; all 9 locale files updated; homepage renders every category; no slug changed.

## 5. Waves 1–8 (weeks 2–17)

This document is the program roadmap; **each wave gets its own spec → implementation plan cycle at kickoff**, grounded in this ranking. Estimates are planning targets, not commitments.

Ranking rule: traffic-per-engineering-hour first, technical risk last. Every wave reuses a chassis from an earlier one. Every wave ships with locales ×9, blog posts, sitemap/README sync, and a launch action.

### Wave 1 — Weeks 2–3: Instant volume
- **Target-size compressor engine** (greenfield): iterative quality/dimension search to hit a KB target; lives inside Image Compression as a "target size" mode.
- **Programmatic landing pages** over that engine: compress-image-to-20KB/50KB/100KB/200KB, signature-resize-10-20KB, compress-JPEG-to-*, etc. (~15 pages × 9 locales). Each page: distinct H1, use-case copy (exam-form specs), FAQ — no thin duplicates (see §7).
- **HEIC→JPG landing page** over existing `heic2any` engine (+ HEIC→PNG variant).
- **Device tester pack**: keyboard tester, gamepad tester, dead-pixel test (new, trivial); mic/webcam tester already exists — split landing pages ("mic test", "webcam test") over the existing component.
- **Crop Image + Watermark Image** broken out of ImageResizer as standalone pages (code exists).
- Launch: sitemap ping; blog cluster on exam-upload size limits.

### Wave 2 — Weeks 4–5: PDF Workbench (make `/tools/pdf` honest AND great)
- Add to existing PDFTools: compress (image re-encode pipeline), persisted rotate, page reorder (drag-drop grid), watermark, text extraction (pdf.js), **Sign PDF** (SignatureMaker integrated via pdf-lib placement UI).
- Dedicated landing pages per operation (merge-pdf, split-pdf, compress-pdf, sign-pdf, …) all driving the one Workbench with the operation pre-selected.
- **Invoice experiment rides along**: $5 unlock (white-label/templates) + "Need this as an API?" waitlist link on the invoice page.
- Launch: this is the biggest query set — blog cluster + outreach.

### Wave 3 — Weeks 6–7: Benchmark suite (viral loop)
- Reaction time, CPS test, number memory, aim trainer (new); Typing Test upgraded (15/30/60s modes, history).
- **Shareable score card** with browserytools.com branding — adapt the stashed dev-card holographic renderer (`git stash@{0}`) as the share-card engine.
- New Tests & Games category is the hub. Launch: Reddit/HN-friendly ("we made a prettier Human Benchmark, fully client-side").

### Wave 4 — Weeks 8–9: Daily-return packs
- **Teacher pack**: Wheel of Names (real canvas wheel; upgrade/absorb RandomPicker's list tab), random group maker, bingo card generator, classroom timer (fullscreen preset of existing Timer).
- **Word-game solvers**: unscrambler / Wordle helper / anagram over one dictionary engine.
- Launch: teacher-community outreach; School & Learning category fills out.

### Wave 5 — Weeks 10–11: Subtitle Studio (flagship #1)
- Video in → existing Whisper pipeline → editable subtitle timeline (text + timing) → styled caption burn-in via ffmpeg.wasm (from Phase 0 singleton) → export MP4 + SRT/VTT.
- Kills the Veed/Kapwing watermark tier. Launch: Product Hunt.

### Wave 6 — Weeks 12–13: Audio wave (+ Audio Editor rebuilt honestly)
- **Audio cutter/ringtone maker** (ffmpeg.wasm) — becomes the real Audio Editor.
- **Vocal remover** (MDX-Net/UVR models via onnxruntime-web — the ~20M/mo query). Spike first: model size/perf feasibility gate.
- Pitch/speed changer, mic guitar tuner, metronome.
- Launch: musician communities.

### Wave 7 — Weeks 14–15: Document conversion
- **PDF → Word** (pdf.js extraction → docx build; "good enough" fidelity, honest about limits), **Word → PDF** (docx render → print pipeline).
- OCR upgrade: preprocessing (binarize/deskew), more languages, PDF input, positioned next to Workbench.
- Deferred to here deliberately: biggest queries but hardest client-side fidelity; PDF chassis battle-tested by then.

### Wave 8 — Weeks 16–17: Local-AI headliner
- **Chat with your PDF — 100% local** (WebLLM ~3B on WebGPU + local embeddings; hardware-gated with graceful message).
- **Study Kit**: PDF/lecture → on-device summary + flashcards (IndexedDB, spaced repetition).
- Launch: HN ("your PDF never leaves your browser — chat with it offline").

## 6. Delegation model (token economics)

- **Fable 5 (main session)**: architecture, chassis/engine design, wave kickoff specs, code review, anything ambiguous.
- **Opus subagents**: component implementation from a written spec (compressor engine, PDF ops, benchmark games, wheel).
- **Sonnet/Haiku subagents**: mechanical volume — locale JSON injection ×9, programmatic landing-page variants, blog drafts, test boilerplate, README/sitemap sync.
- Verification stays in the main session: every wave ends with `bun run test`, `bun run build`, and a manual smoke of new pages before merge.

## 7. SEO guardrails

- **Programmatic pages must have substance**: unique H1, intro tied to the real use case (e.g. which exam portals demand 20KB), 3–5 FAQ entries, distinct meta description. No find-and-replace bodies, or Google will treat the family as doorway spam.
- **URL stability**: no slug renames anywhere in this program; category moves are display-only.
- **Landing pages over shared engines** (HEIC→JPG, mic test, merge-pdf, …) each render the real tool with presets applied — functional pages, not thin shells.
- **Internal linking**: each new page links siblings (compress-to-20KB ↔ 50KB ↔ resizer) and its category hub.

## 8. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Programmatic family flagged as thin content | Per-page substance rules (§7); start with ~15 pages, expand only after indexing confirms health |
| Vocal remover model too heavy/slow in-browser | Feasibility spike gates Wave 6 scope; fallback = ship cutter/pitch/tuner without it |
| PDF→Word fidelity disappoints | Honest positioning ("editable text, layout approximate"); ship behind clear expectations copy |
| WebLLM hardware exclusion | Capability detection + graceful "your device can't run this locally" message; Study Kit uses lighter models as the broad-reach sibling |
| Sequential waves slip | Waves are independent; a slipped wave delays, never blocks, the next |
| MediaRecorder/browser API variance (Video Editor fix) | Prefer ffmpeg path for conversions; feature-detect and hide unsupported options |

## 9. Per-wave release checklist

1. Locale entries ×9 (`Tools.<Component>` + `ToolsConfig.tools.<slug>`)
2. README + `validate-tools.js` green
3. Sitemap updated; 2–3 blog posts (en + ar minimum)
4. `bun run test` + `bun run build --webpack` green (Turbopack deadlocks — repo caveat)
5. Manual smoke on new pages (desktop + mobile viewport)
6. Launch action executed (per wave above)
7. Post-ship: Vercel Analytics annotation; check indexing after ~1 week
