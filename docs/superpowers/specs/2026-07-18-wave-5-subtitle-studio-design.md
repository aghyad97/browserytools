# Wave 5 — Subtitle Studio (spec)

**Date:** 2026-07-18 · **Branch:** `wave-5-subtitle-studio` (off main @ef450c4) · **Roadmap:** §5 Wave 5 (flagship #1) · **Design contract:** R3 interior contract (binding)

**Goal:** a fully client-side subtitle studio: drop in a video, auto-transcribe with Whisper, edit the cues (text + timing) on a timeline, style captions (static AND animated: karaoke / pop-on / per-word), preview them faithfully, and export a burned-in MP4 plus SRT/VTT — no upload, no watermark. Positioned to replace the Veed/Kapwing watermark tier. Ships as ONE wave (static + animated together). Launch: Product Hunt.

## 1. Architecture — the faithful-preview principle

The non-negotiable design rule: **preview and export use ONE renderer**, so what the user sees is what burns in. That renderer is **libass**, run in the browser via **JASSUB** (libass compiled to wasm, MIT/ISC, self-hosted). The pipeline:

```
video file
  → HTML5 <video> (preview surface)
  → decode audio → 16kHz mono Float32 (reuse AudioTranscriber's decoder)
  → Whisper (hf-pipeline) with return_timestamps:"word"  → word-timed transcript
  → CUE MODEL  (the single editable source of truth)
       ├─ edit: text, start/end, split, merge, retime  (live)
       ├─ style: preset + core controls + animation preset
       → ASS script (styles + dialogue events; \k / \fad / per-word)
            ├─ PREVIEW: JASSUB renders ASS onto a canvas synced over <video>  (real-time)
            └─ EXPORT:
                 ├─ SRT / VTT  ← straight from the cue model (NO ffmpeg)
                 └─ MP4 burn   ← JASSUB rasterizes the caption track to a
                                 transparent layer; STOCK ffmpeg composites it
                                 via the `overlay` filter → MP4
```

Because both preview and the MP4 burn consume the *same* JASSUB/libass output, they cannot diverge. Stock `@ffmpeg/core@0.12.10` (already shipped) has no libass, but it DOES have `overlay` — so no custom ffmpeg build is needed (**Path B**, chosen over compiling a libass-enabled core).

### 1.1 Task-1 spike (front-loads the whole wave's risk)
Before ANY studio UI is built, a spike must prove, end to end in a real browser: one hard-coded styled ASS caption → JASSUB rasterized layer → stock-ffmpeg `overlay` → a **playable MP4** that visibly contains the caption. It must also confirm: (a) JASSUB loads fully self-hosted from `/public` with NO external/CDN fetch (CSP + privacy ethos — a hard rule), and (b) a bundled font file is picked up by BOTH JASSUB (preview) and the overlay path (burn), so the two match. If the spike can't produce a playable MP4 within the short-form envelope, STOP and escalate — do not build the UI on an unproven burn.

## 2. Cue model — `src/lib/subtitles/cues.ts` (pure, unit-tested)
```ts
interface Word { start: number; end: number; text: string }
interface Cue { id: string; start: number; end: number; text: string; words?: Word[] }
type CueDoc = Cue[]   // ordered by start
```
Pure operations (each unit-tested against fixtures, no ffmpeg/JASSUB): `fromWhisperChunks(chunks)` → CueDoc (build cues from word-timed Whisper output, grouping words into readable cues by gap/length heuristics); `splitCue(doc, id, atTime)`, `mergeCues(doc, idA, idB)`, `retime(doc, id, {start?, end?})` (with overlap guards — a cue may not overlap its neighbours), `shiftAll(doc, deltaSeconds)`; `buildSrt(doc)`, `buildVtt(doc)` (lift the existing `srtTime`/`vttTime`/`buildSrt`/`buildVtt` out of `AudioTranscriber.tsx` into here so both tools share one implementation — AudioTranscriber rewires to import them, byte-identical output, its tests stay green).

## 3. ASS generation — `src/lib/subtitles/ass.ts` (pure, unit-tested)
`toAss(doc: CueDoc, style: CaptionStyle, videoDims: {w,h}): string` → a valid ASS script:
- `[Script Info]` with `PlayResX/PlayResY` = video dims (so positions/sizes are resolution-correct).
- `[V4+ Styles]` — one style from `CaptionStyle`: font name, size, primary/outline/back colours (ASS `&HAABBGGRR`), outline width, shadow, bold, alignment (numpad 1–9 → the position control), margins.
- `[Events]` — one `Dialogue` per cue. Animation preset maps here:
  - `none` → plain text.
  - `pop-on` → `{\fad(120,80)}`.
  - `karaoke` → per-word `{\k<centiseconds>}` runs from `cue.words` (requires word timing).
  - `word-highlight` → per-word colour swap via `\k` + a secondary colour.
- Escaping: ASS special chars (`{`, `}`, `\`, newlines) handled; RTL text passes through (libass shapes it).
`CaptionStyle` is a plain typed object (preset defaults + overrides). Presets (TikTok-bold, clean-caption, subtitle-bar, plus the animation presets) are named `CaptionStyle` literals.

## 4. JASSUB integration — `src/lib/subtitles/jassub.ts`
- Self-hosted: JASSUB's wasm + worker + a bundled default font ship under `/public/jassub/` via a `scripts/copy-jassub.mjs` (mirrors `copy-ffmpeg.mjs`), wired into the existing `copy-assets` predev/prebuild step. NO CDN, NO external font fetch (verified in the spike).
- `mountPreview(video: HTMLVideoElement, getAss: () => string)` → attaches a JASSUB instance rendering the current ASS over the video, re-fed when the ASS changes; torn down on unmount.
- `renderTrackToLayer(ass, dims, fps, duration)` → the burn helper: rasterize the caption track to whatever the overlay path needs (image sequence or a transparent webm/mov — the spike decides the exact handoff; document it here after the spike). Progress events.

## 5. Burn pipeline — `src/lib/subtitles/burn.ts`
`burnMp4({ videoFile, ass, dims, duration, onProgress }): Promise<Blob>`:
- Guard the **short-form envelope**: if `duration > ~5 min` OR height `> 1080`, the caller shows a warning and lets the user proceed at their own risk (SRT/VTT always allowed). Above a hard ceiling (document it after the spike measures memory) block MP4 burn with an honest message pointing to sidecar export.
- Steps: get the ffmpeg singleton; write the source video; obtain the JASSUB caption layer (§4); `overlay` composite; `-c:v` re-encode to MP4 (H.264 if the core supports it — the spike confirms; else document the real output codec/container honestly in the UI). Read out the Blob. Emit progress the whole way.
- HONESTY: state plainly in the UI what the export actually is (re-encoded; codec; that long/large videos may be slow or refused). No silent failure — the CompressVideo/audit lesson.

## 6. Components
- `src/components/SubtitleStudio.tsx` — ToolShell + orchestration; owns `CueDoc` + `CaptionStyle` + playback state.
- `src/components/subtitle-studio/` panels: `TranscribePanel` (drop video, model/lang options, run — reuse hf-pipeline + the decoder), `CueEditor` (per-cue rows: editable text, start/end, split/merge; click-to-seek; the timeline), `StylePanel` (preset picker + core controls + animation preset), `PreviewStage` (the `<video>` + JASSUB canvas + transport), `ExportPanel` (SRT / VTT / MP4 with the envelope warning + progress).
- Reuse: `@/lib/hf-pipeline`, `@/lib/media/ffmpeg`, AudioTranscriber's decode-to-16k helper (extract it to `src/lib/media/decode-audio.ts` and have both tools import it — it's currently private in AudioTranscriber).

## 7. Plumbing (per W1–W4 conventions)
- **tools-config**: one entry in **Media Tools** (`mediaTools`); field order `name→href→icon→available→order→creationDate`; DISTINCT lucide icon (verify unused, appears exactly twice in the file); `available:true`; `creationDate:"2026-07-18"`. Slug `/tools/subtitle-studio`, component `SubtitleStudio`.
- **The 4 registration points (each missed ≥1× in W4 — do ALL):** tools-config entry; `HAS_OWN_H1` in `tool-title.tsx` (else duplicate `<h1>` — verify `grep -o "<h1" | wc -l` == 1 on the route); `tool-popularity.ts` (else sinks to grid bottom — "subtitle generator" / "add subtitles to video" are strong terms, rank mid-high); `README.md` (grid tool).
- **i18n**: `Tools.SubtitleStudio` (all UI strings) + `ToolsConfig.tools.subtitle-studio` ({name, description}) in `messages/en.json`, English-placeholder copies in all 8 other locales, then ONE fan-out task translates (8 parallel agents, one per locale, from a generated manifest). Locale parity invariant: every new en key needs same-key copies in all 8 others or tsc fails.
- **SEO content**: bespoke `tool-content.ts` entry (en + ar) — real scenarios (captioning reels/shorts for reach and accessibility; the no-watermark angle; runs on-device, video never uploaded); FAQ honest about the burn envelope, the re-encode, and English-dictionary-independence (any Whisper language). `related`: audio-transcriber, compress-video, video, screen-recorder.
- **OG/Twitter images** per route (mirror an existing tool); **e2e** `tool-routes.json` regenerated AFTER the page exists.
- **onDevice**: true (fully local) — but the models/wasm are large; the UI must state the one-time download honestly (Whisper weights + JASSUB + the model already have this pattern in AudioTranscriber).

## 8. Blog (en + ar)
1. `add-subtitles-to-video-free` — the flagship post: auto-caption a video in the browser, edit, style (incl. TikTok-style animated captions), export MP4 with no watermark, nothing uploaded. Links the tool top/inline/end (ToolCTA).
2. `burn-subtitles-vs-srt` — when to hard-burn vs. ship an SRT sidecar; honest on the re-encode + size envelope.

## 9. Testing & gates
- **Unit (no wasm/models):** `cues.ts` (fromWhisperChunks grouping; split/merge/retime overlap guards; SRT/VTT byte-output — reuse AudioTranscriber's existing expectations); `ass.ts` (style→ASS header correctness; per-preset dialogue lines; `\k` centisecond math from word timings; escaping; RTL passthrough). Components mock hf-pipeline, JASSUB, and ffmpeg — never load real weights/wasm in tests.
- **Real-browser (mandatory, not curl):** the Task-1 spike MP4; and at ship, a manual drive — transcribe a short clip, edit a cue, switch a style + an animation preset, confirm the JASSUB preview updates, export SRT and a burned MP4 that plays and shows the captions. Dark + one RTL (ar) + mobile viewport.
- **CSS gate (W4 lesson):** any `*.module.css` change also runs `CI=true bun run build` (CSS Modules don't compile under vitest/tsc/lint; a bad module 500s every route).
- **Per-task gates:** `bun run test` · `bunx tsc --noEmit` · `bun run lint` · `bun run validate`. Wave-level: `CI=true bun run build` · `CI=true bun run e2e:smoke` · full suite under `LC_ALL=en_US.UTF-8 TZ=UTC` (locale-fragile-test lesson).
- **Parallel-agent rule (W4 lesson):** implementer agents run ONE AT A TIME in the shared worktree (their `git add` collides); only read-only agents parallelize.

## 10. Out of scope
Multi-track/translation subtitles, speaker diarization/labels, subtitle import (SRT-in) editing, cloud render, non-`overlay` compositing, a custom libass-enabled ffmpeg core (Path A — only revisit if the spike kills Path B), GIF/WebM caption export, per-cue independent styling beyond the global style + animation preset (cue-level overrides are a follow-up).
