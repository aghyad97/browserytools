# Wave 5 — Subtitle Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A fully client-side Subtitle Studio — drop a video, auto-transcribe with Whisper, edit cues, style captions (static + karaoke/animation), preview faithfully, export a burned MP4 + SRT/VTT, nothing uploaded.

**Architecture:** ONE renderer (libass via JASSUB) drives both preview and the MP4 burn, so preview == export by construction. Pure logic (cue model, ASS generation) lives in `src/lib/subtitles/` and is unit-tested with fixtures; JASSUB and stock ffmpeg (`overlay` filter — no custom core) do the rendering/compositing; a thin component layer wraps it in ToolShell.

**Tech Stack:** Next 15 App Router, React 18, TS, `@huggingface/transformers` (Whisper, existing `hf-pipeline.ts`), `@ffmpeg/ffmpeg` 0.12.15 + stock `@ffmpeg/core` 0.12.10 (existing `src/lib/media/ffmpeg.ts`), **jassub@2.5.7** (libass-wasm, MIT, NEW), next-intl, Vitest + Testing Library.

## Global Constraints

- **Faithful-preview rule:** preview and MP4 burn MUST consume the same JASSUB/libass output. Never render captions two different ways.
- **Fully self-hosted:** JASSUB wasm + worker + bundled font ship under `public/jassub/`; NO CDN, NO external font fetch (CSP + privacy). Verified in Task 1.
- **No real models/wasm in tests:** unit tests mock `hf-pipeline`, `jassub`, and `@/lib/media/ffmpeg`, and never load `/wordlist.txt`-style large assets. Pure-logic tests use plain fixtures.
- **Short-form envelope:** MP4 burn targeted at ≤~5 min / ≤1080p; beyond, warn but allow (SRT/VTT always allowed); above the hard ceiling the spike measures, block MP4 with an honest message.
- **Honesty (audit/CompressVideo lesson):** UI states plainly what export is (re-encode, actual codec, that long/large videos may be slow/refused). No silent failure.
- **4 registration points for the grid tool** (each missed ≥1× in W4): tools-config entry (DISTINCT icon — grep it appears exactly twice in the file); `HAS_OWN_H1` in `src/components/layout/tool-title.tsx` (verify route renders exactly ONE `<h1>`); `src/lib/tool-popularity.ts`; `README.md`.
- **tools-config field order:** `name → href → icon → available → order → creationDate`. `creationDate:"2026-07-18"`.
- **Locale parity (hard):** every new key in `messages/en.json` needs same-key copies in all 8 other locale files or tsc fails. Component tasks add English placeholders ×8; Task 17 translates.
- **CSS gate (W4 lesson):** any task touching a `*.module.css` ALSO runs `CI=true bun run build` before commit — CSS Modules don't compile under vitest/tsc/lint; a bad module 500s every route.
- **Gates per task:** `bun run test` · `bunx tsc --noEmit` · `bun run lint`. Wave-level: `bun run validate` · `CI=true bun run build` · `CI=true bun run e2e:smoke` · full suite under `LC_ALL=en_US.UTF-8 TZ=UTC`.
- **Execution rule (W4 lesson):** implementer agents run ONE AT A TIME in this shared worktree (concurrent `git add` collides). Only read-only agents parallelize.
- **Commit style:** no AI footers; no wave numbers in PR title/body.

---

## Phase A — Prove the burn (do NOT build UI until this passes)

### Task 1: Burn-in spike — JASSUB → stock-ffmpeg `overlay` → playable MP4

**Files:**
- Add dep: `jassub@2.5.7` (`bun add jassub`)
- Create: `scripts/copy-jassub.mjs` (mirror `scripts/copy-ffmpeg.mjs`); wire into the `copy-assets` script in `package.json` (the `predev`/`prebuild` chain)
- Create: `public/jassub/` (wasm + worker + one default font, copied by the script)
- Create: `scripts/spike-burn/` — a throwaway spike route or node+playwright script (delete after; NOT shipped)
- Create: `docs/superpowers/specs/2026-07-18-wave-5-spike-findings.md` — the spike's documented outputs

**This is a SPIKE, not TDD.** Goal: prove the risky path end-to-end before anything is built on it.

- [ ] **Step 1:** `bun add jassub` and write `scripts/copy-jassub.mjs` copying JASSUB's `jassub.wasm`, `jassub-worker.js` (+ `.wasm` worker variant if present), and one bundled font (e.g. its default) from `node_modules/jassub/dist/` to `public/jassub/`. Add it to `copy-assets` in package.json. Run `bun run copy-assets`; confirm the files land in `public/jassub/`.
- [ ] **Step 2:** Build a minimal spike page/script that: loads a short test MP4 (put one at `public/jassub/spike-sample.mp4` or reuse a `.playwright-mcp` fixture), mounts a JASSUB instance over a `<video>` with a hard-coded ASS string containing ONE styled caption (a `\k` karaoke line to also prove animation), and renders it. In a REAL browser (playwright-core against `bun run dev`), screenshot the video+caption and confirm the caption is visibly composited on screen.
- [ ] **Step 3 (the critical one):** rasterize the caption track from JASSUB and composite it into an MP4 with the STOCK ffmpeg `overlay` filter. Determine and document the exact handoff that works: image sequence (`overlay` fed PNG frames) vs a transparent WebM/MOV overlay input. Produce an output MP4, write it to disk, and CONFIRM it plays and visibly contains the caption (open it / probe streams).
- [ ] **Step 4:** verify NO external network fetch occurred for JASSUB or fonts (capture requests; assert nothing hits a non-localhost host). Verify the SAME font file is used by preview and burn.
- [ ] **Step 5:** measure and record in the findings doc: (a) the working handoff format + exact ffmpeg args, (b) the real output codec/container (H.264/mp4? or what the stock core actually produces), (c) rough time + peak memory for a ~30s 720p clip → extrapolate the hard ceiling for the envelope, (d) any gotchas. If NO playable MP4 is achievable within the envelope, STOP and escalate to the human (Path A / rescope) — do not proceed to Phase B.
- [ ] **Step 6:** delete the throwaway spike page/script (keep `copy-jassub.mjs`, `public/jassub/`, and the findings doc). Commit — `feat(subtitles): self-host JASSUB + burn-in spike findings`.

> **Later tasks (5, 12) MUST follow the findings doc's handoff format and ffmpeg args verbatim.**

---

## Phase B — Pure foundations (TDD, no wasm)

### Task 2: Extract the shared audio decoder + SRT/VTT builders

**Files:**
- Create: `src/lib/media/decode-audio.ts`, `src/lib/subtitles/cues.ts`
- Modify: `src/components/AudioTranscriber.tsx` (import the extracted helpers instead of its private copies)
- Test: `src/__tests__/lib/subtitles/cues.test.ts`

**Interfaces:**
- Produces:
  - `decode-audio.ts`: `decodeToMono16k(file: File): Promise<Float32Array>` (moved verbatim from AudioTranscriber).
  - `cues.ts`: `interface Word { start:number; end:number; text:string }`, `interface Cue { id:string; start:number; end:number; text:string; words?:Word[] }`, `type CueDoc = Cue[]`; `srtTime(s:number):string`, `vttTime(s:number):string`, `buildSrt(doc:CueDoc):string`, `buildVtt(doc:CueDoc):string`.

- [ ] **Step 1: Write failing tests** for `buildSrt`/`buildVtt`/`srtTime` against a small CueDoc fixture, copying the exact expected format from AudioTranscriber's current output (`N\nHH:MM:SS,mmm --> HH:MM:SS,mmm\ntext\n`). Include `vttTime` uses `.` not `,`.

```ts
import { describe, it, expect } from "vitest";
import { srtTime, vttTime, buildSrt, buildVtt, type CueDoc } from "@/lib/subtitles/cues";
const doc: CueDoc = [
  { id: "a", start: 0, end: 1.5, text: "Hello" },
  { id: "b", start: 1.5, end: 3, text: "world" },
];
describe("srt/vtt", () => {
  it("srtTime uses comma ms", () => expect(srtTime(1.5)).toBe("00:00:01,500"));
  it("vttTime uses dot ms", () => expect(vttTime(1.5)).toBe("00:00:01.500"));
  it("buildSrt numbers cues", () => expect(buildSrt(doc)).toContain("1\n00:00:00,000 --> 00:00:01,500\nHello"));
  it("buildVtt has header", () => expect(buildVtt(doc).startsWith("WEBVTT")).toBe(true));
});
```

- [ ] **Step 2:** Run → FAIL (not exported).
- [ ] **Step 3:** Move `decodeToMono16k`, `srtTime`, `vttTime`, `buildSrt`, `buildVtt` from `AudioTranscriber.tsx` into the two new files (adapt `buildSrt/buildVtt` to take `CueDoc` — the Chunk→Cue field names differ; keep output byte-identical). Rewire `AudioTranscriber.tsx` to import them; convert its `Chunk[]` to `CueDoc` at the call site (or keep a thin adapter). Its existing tests MUST stay green.
- [ ] **Step 4:** Run new + AudioTranscriber tests → PASS.
- [ ] **Step 5:** Commit — `refactor(media): extract shared audio decoder + SRT/VTT to src/lib`.

### Task 3: Cue model operations

**Files:** Modify `src/lib/subtitles/cues.ts`; Test `src/__tests__/lib/subtitles/cues-ops.test.ts`.

**Interfaces:**
- Produces: `fromWhisperWords(words: Word[], opts?: { maxCharsPerCue?: number; maxGap?: number }): CueDoc`; `splitCue(doc: CueDoc, id: string, atTime: number): CueDoc`; `mergeCues(doc: CueDoc, idA: string, idB: string): CueDoc`; `retime(doc: CueDoc, id: string, t: { start?: number; end?: number }): CueDoc`; `shiftAll(doc: CueDoc, delta: number): CueDoc`. All pure (return new docs), all guard overlaps (a cue never overlaps a neighbour; retime clamps).

- [ ] **Step 1: Failing tests:**

```ts
import { fromWhisperWords, splitCue, mergeCues, retime, type Word } from "@/lib/subtitles/cues";
const words: Word[] = [
  { start: 0, end: 0.4, text: "The" }, { start: 0.4, end: 0.8, text: "quick" },
  { start: 2.0, end: 2.4, text: "brown" }, { start: 2.4, end: 2.8, text: "fox" },
];
describe("cue ops", () => {
  it("fromWhisperWords splits on a large gap", () => {
    const doc = fromWhisperWords(words, { maxGap: 1.0 });
    expect(doc).toHaveLength(2); // gap 0.8->2.0 breaks the cue
    expect(doc[0].text).toBe("The quick");
    expect(doc[0].words).toHaveLength(2);
  });
  it("retime clamps so cues never overlap", () => {
    const doc = fromWhisperWords(words, { maxGap: 1.0 });
    const r = retime(doc, doc[1].id, { start: doc[0].end - 5 }); // try to overlap
    expect(r[1].start).toBeGreaterThanOrEqual(doc[0].end);
  });
  it("mergeCues joins text + words and spans both times", () => {
    const doc = fromWhisperWords(words, { maxGap: 1.0 });
    const m = mergeCues(doc, doc[0].id, doc[1].id);
    expect(m).toHaveLength(1);
    expect(m[0].text).toBe("The quick brown fox");
    expect(m[0].end).toBe(2.8);
  });
});
```

- [ ] **Step 2:** FAIL → **Step 3:** implement (grouping by gap + char budget; splices with overlap clamps; stable ids via an injected counter or `id = \`${start}-${i}\``, NOT Math.random — it's banned in some contexts and hurts test determinism) → **Step 4:** PASS.
- [ ] **Step 5:** Commit — `feat(subtitles): cue model operations`.

### Task 4: ASS generation

**Files:** Create `src/lib/subtitles/ass.ts`, `src/lib/subtitles/styles.ts`; Test `src/__tests__/lib/subtitles/ass.test.ts`.

**Interfaces:**
- Produces (`styles.ts`): `interface CaptionStyle { fontName:string; fontSize:number; primary:string; outline:string; back:string; outlineWidth:number; shadow:number; bold:boolean; alignment:1|2|3|4|5|6|7|8|9; marginV:number; box:boolean; animation:"none"|"pop-on"|"karaoke"|"word-highlight" }`; `PRESETS: Record<string, CaptionStyle>` (`tiktok-bold`, `clean-caption`, `subtitle-bar`).
- Produces (`ass.ts`): `hexToAssColor(hex: string): string` (`#RRGGBB` → `&H00BBGGRR`); `toAss(doc: CueDoc, style: CaptionStyle, dims: { w:number; h:number }): string`.

- [ ] **Step 1: Failing tests:**

```ts
import { toAss, hexToAssColor } from "@/lib/subtitles/ass";
import { PRESETS } from "@/lib/subtitles/styles";
import type { CueDoc } from "@/lib/subtitles/cues";
const doc: CueDoc = [{ id: "a", start: 0, end: 1, text: "Hi", words: [{ start:0, end:1, text:"Hi" }] }];
describe("ass", () => {
  it("hexToAssColor flips RGB->BGR with 00 alpha", () => expect(hexToAssColor("#112233")).toBe("&H00332211"));
  it("toAss has header sized to the video", () => {
    const s = toAss(doc, PRESETS["clean-caption"], { w: 1080, h: 1920 });
    expect(s).toContain("PlayResX: 1080");
    expect(s).toContain("PlayResY: 1920");
    expect(s).toMatch(/\[V4\+ Styles\]/);
    expect(s).toMatch(/Dialogue:.*Hi/);
  });
  it("karaoke emits \\k centisecond tags from word timings", () => {
    const kdoc: CueDoc = [{ id:"a", start:0, end:1, text:"a b", words:[{start:0,end:0.5,text:"a"},{start:0.5,end:1,text:"b"}] }];
    const s = toAss(kdoc, { ...PRESETS["clean-caption"], animation: "karaoke" }, { w:1280, h:720 });
    expect(s).toMatch(/\{\\k50\}a/); // 0.5s = 50cs
  });
});
```

- [ ] **Step 2:** FAIL → **Step 3:** implement (proper ASS header, one `Style:` line from `CaptionStyle`, one `Dialogue:` per cue; animation switch: `none` plain, `pop-on` `{\fad(120,80)}`, `karaoke`/`word-highlight` per-word `{\k<cs>}` from `cue.words` with cs = round((w.end-w.start)*100); escape `{}\` and newlines→`\N`) → **Step 4:** PASS.
- [ ] **Step 5:** Commit — `feat(subtitles): ASS script generation`.

---

## Phase C — Renderers (JASSUB + burn; follow Task-1 findings)

### Task 5: JASSUB singleton + preview mount

**Files:** Create `src/lib/subtitles/jassub.ts`; Test `src/__tests__/lib/subtitles/jassub.test.ts` (mock the `jassub` module — assert wiring only, no real wasm).

**Interfaces:**
- Produces: `mountPreview(video: HTMLVideoElement, canvas: HTMLCanvasElement, ass: string): JassubHandle` where `JassubHandle = { setAss(ass:string): void; destroy(): void }`. Constructs a JASSUB instance pointed at the self-hosted `public/jassub/` assets + bundled font; re-feeds ASS on `setAss`; cleans up on `destroy`.

- [ ] **Step 1:** Failing test — `vi.mock("jassub")` with a fake class; assert `mountPreview` constructs it with the self-hosted `workerUrl`/`wasmUrl`/`fonts` paths under `/jassub/`, that `setAss` calls the instance's setTrack-equivalent, and `destroy` calls its `destroy`.
- [ ] **Step 2:** FAIL → **Step 3:** implement per the JASSUB API confirmed in Task 1 (constructor options: `canvas`, `video`, `workerUrl`, `wasmUrl`, `subContent`/`subUrl`, `fonts`/`availableFonts`). Use the EXACT asset paths the spike proved. → **Step 4:** PASS.
- [ ] **Step 5:** Commit — `feat(subtitles): JASSUB preview singleton`.

### Task 6: Burn pipeline

**Files:** Create `src/lib/subtitles/burn.ts`; Test `src/__tests__/lib/subtitles/burn.test.ts` (mock `@/lib/media/ffmpeg` + the JASSUB rasterizer; assert the arg sequence + envelope gating, NOT a real encode).

**Interfaces:**
- Consumes: `getFFmpeg()` from `@/lib/media/ffmpeg`; the JASSUB rasterizer from Task 5/Task-1 findings.
- Produces: `EXPORT_LIMITS = { warnSeconds: 300, warnHeight: 1080, maxSeconds: <from spike> }`; `burnMp4(opts: { videoFile: File; ass: string; dims:{w:number;h:number}; duration:number; onProgress?: (p:number)=>void }): Promise<Blob>`; `envelopeStatus(duration:number, height:number): "ok" | "warn" | "blocked"`.

- [ ] **Step 1:** Failing tests — `envelopeStatus` returns `ok`/`warn`/`blocked` at the thresholds; `burnMp4` throws a typed error when `blocked`; on the happy path it calls ffmpeg `writeFile` → the exact `overlay` `exec` args from the spike findings → `readFile` and returns a Blob (all mocked).
- [ ] **Step 2:** FAIL → **Step 3:** implement following the Task-1 findings doc's handoff + args verbatim; emit progress via ffmpeg's `progress` event (see CompressVideo). → **Step 4:** PASS.
- [ ] **Step 5:** Commit — `feat(subtitles): MP4 burn pipeline (JASSUB layer + ffmpeg overlay)`.

---

## Phase D — Studio UI

> Each UI task: mock heavy deps in tests. The tool follows an existing multi-panel component (study `src/components/AudioTranscriber.tsx` for the transcribe+download pattern and `src/components/CompressVideo.tsx` for the ffmpeg-progress pattern). Page mirrors `src/app/tools/text-counter/page.tsx`.

### Task 7: SubtitleStudio shell + Transcribe panel

**Files:** Create `src/components/SubtitleStudio.tsx`, `src/components/subtitle-studio/TranscribePanel.tsx`, `src/app/tools/subtitle-studio/page.tsx`, test. Modify `src/lib/tools-config.ts` (mediaTools, icon `CaptionsIcon` — verify unused + exists), `src/components/layout/tool-title.tsx` (HAS_OWN_H1), `src/lib/tool-popularity.ts`, `README.md`, `messages/*.json` (×9: `Tools.SubtitleStudio` + `ToolsConfig.tools.subtitle-studio`).

**Interfaces:**
- Produces: `SubtitleStudio` owns `CueDoc`, `CaptionStyle`, the loaded `File`, and video dims; `TranscribePanel` takes `{ onTranscribed(doc: CueDoc, file: File, dims:{w:number;h:number}): void }`.

- [ ] **Step 1:** Failing test — mock `@/lib/hf-pipeline` (`getPipeline` → a fake transcriber returning word-timed chunks) and `@/lib/media/decode-audio`; render, upload a video File, run transcribe, assert `onTranscribed` fires with a non-empty CueDoc built via `fromWhisperWords`. Route test: exactly ONE `<h1>`.
- [ ] **Step 2–4:** implement (video drop → `decodeToMono16k` → `getPipeline("automatic-speech-recognition", ...)` with `return_timestamps: "word"` → `fromWhisperWords`; read `videoWidth/Height` from a `<video>` for dims). Honest one-time-download note (reuse AudioTranscriber copy).
- [ ] **Step 5:** config + 4 registration points + en/placeholder locales + page. Verify route 200 + h1==1 on `bun run dev`.
- [ ] **Step 6: build gate** (new page + any module.css) + Commit — `feat(tools): Subtitle Studio shell + transcribe`.

### Task 8: Cue editor

**Files:** Create `src/components/subtitle-studio/CueEditor.tsx`, test.

**Interfaces:**
- Consumes: cue ops from `cues.ts`.
- Produces: `<CueEditor doc={CueDoc} onChange={(d:CueDoc)=>void} onSeek={(t:number)=>void} />` — per-cue rows: editable text (updates cue.text), editable start/end (calls `retime`), split at playhead, merge-with-next; clicking a cue calls `onSeek(cue.start)`.

- [ ] **Steps:** failing test (edit a cue's text → onChange with updated doc; click split → 2 cues; merge → 1) → implement → PASS → commit `feat(subtitles): cue editor`.

### Task 9: Style panel

**Files:** Create `src/components/subtitle-studio/StylePanel.tsx`, test.

**Interfaces:**
- Consumes: `PRESETS`, `CaptionStyle` from `styles.ts`.
- Produces: `<StylePanel value={CaptionStyle} onChange={(s:CaptionStyle)=>void} />` — preset picker + controls (font, size, colour, outline, box toggle, position 1–9, animation preset). Content colours (the caption's own colours) are inline per R3; chrome uses tokens.

- [ ] **Steps:** failing test (pick a preset → onChange with that preset; change colour → onChange merges) → implement → PASS → commit `feat(subtitles): style panel`.

### Task 10: Preview stage

**Files:** Create `src/components/subtitle-studio/PreviewStage.tsx`, test (mock `@/lib/subtitles/jassub`).

**Interfaces:**
- Consumes: `mountPreview` from `jassub.ts`; `toAss` from `ass.ts`.
- Produces: `<PreviewStage file={File} doc={CueDoc} style={CaptionStyle} dims={...} />` — a `<video>` + overlay `<canvas>`; mounts JASSUB, re-computes `toAss(doc, style, dims)` and calls `setAss` whenever doc/style change; transport (play/pause/seek); tears JASSUB down on unmount.

- [ ] **Steps:** failing test (mock jassub; render → assert `mountPreview` called; change `style` prop → assert `setAss` re-called with new ASS; unmount → `destroy` called) → implement → PASS → commit `feat(subtitles): preview stage`.

### Task 11: Export panel + wire the studio together

**Files:** Create `src/components/subtitle-studio/ExportPanel.tsx`, test; Modify `src/components/SubtitleStudio.tsx` (compose all panels).

**Interfaces:**
- Consumes: `buildSrt`/`buildVtt` from `cues.ts`; `burnMp4`/`envelopeStatus` from `burn.ts`; `downloadBlob`/`downloadText` from `@/lib/download`.
- Produces: `<ExportPanel file doc style dims duration />` — SRT/VTT buttons (instant); MP4 button gated by `envelopeStatus` (warn banner when `warn`, disabled + honest message when `blocked`), progress bar during burn.

- [ ] **Steps:** failing test (SRT click → `downloadText` with the buildSrt output; MP4 with a `blocked` duration → button disabled + message; MP4 with `ok` → `burnMp4` called, `downloadBlob` on resolve — burn mocked) → implement → compose SubtitleStudio (transcribe → editor+style+preview → export) → PASS → build gate → commit `feat(subtitles): export panel + full studio wiring`.

---

## Phase E — Content, i18n, ship

### Task 12: End-to-end real-browser verification (spike promoted to product)

**Files:** none shipped — a verification pass; if it finds bugs, fix them in the relevant component with a test.

- [ ] Drive the LIVE tool in a real browser (playwright-core vs `bun run dev`, or the devtools MCP): upload a short real clip → transcribe → edit one cue's text and timing → switch preset + turn on karaoke → confirm the JASSUB preview updates and matches → export SRT (opens/valid) → export MP4 (plays, shows the styled captions, matches preview). This is the faithful-preview claim — prove it with eyes on pixels, not curl.
- [ ] Check dark + one RTL (ar) + a mobile viewport.
- [ ] Record findings; fix any bug found (each with a regression test) and commit. Commit — `test(subtitles): end-to-end browser verification + fixes`.

### Task 13: SEO content (`tool-content.ts`, en + ar)

**Files:** Modify `src/lib/tool-content.ts`.
- [ ] Add a `"subtitle-studio"` entry mirroring the `"crop-image"` shape: `related: ["audio-transcriber","compress-video","video","screen-recorder"]` (verify each slug exists), `en` + `ar` with intro (2–3 paras: caption reels/shorts for reach + accessibility; no-watermark; on-device, video never uploaded; works in any Whisper language), 4–5 FAQ (honest about the burn envelope, the re-encode, one-time model download), steps. Native Arabic transcreation. No fabricated stats.
- [ ] `bunx tsc --noEmit` + `bun run test`. Commit — `feat(seo): subtitle-studio content (en+ar)`.

### Task 14: OG/Twitter images + e2e routes

**Files:** Create `opengraph-image.tsx` + `twitter-image.tsx` under `src/app/tools/subtitle-studio/` (mirror an existing tool); regenerate `e2e/tool-routes.json`.
- [ ] Copy the OG/twitter pattern; regenerate the route manifest (the repo's generator) AFTER the page exists; verify the route is present. `CI=true bun run build` green (no missing-metadata error). Commit — `feat(routes): subtitle-studio og/twitter + e2e route`.

### Task 15: Blog cluster (en + ar)

**Files:** Create 4 posts in `src/app/blog/posts/`; add 4 entries to `src/lib/blog-data.ts`.
- [ ] `add-subtitles-to-video-free` (+ `-ar`): the flagship — auto-caption in browser, edit, style incl. animated captions, export MP4 no watermark, nothing uploaded. `burn-subtitles-vs-srt` (+ `-ar`): hard-burn vs SRT sidecar, honest on re-encode + size. Follow the existing post pattern; use `ToolCTA` (from W4) at top (inline) + end (card) with `slug="subtitle-studio"`. blog-data entries `date:"2026-07-18"`, category "Media Tools"/"أدوات الوسائط" (match existing media posts), distinct emoji/gradient.
- [ ] Verify all 4 render (200) + in sitemap. Commit — `feat(blog): subtitle-studio cluster`.

### Task 16: Locale translation fan-out

**Files:** Modify `messages/{ar,de,es,fr,id,pt-BR,ru,zh-CN}.json`.
- [ ] Generate a manifest of every new `Tools.SubtitleStudio.*` + `ToolsConfig.tools.subtitle-studio.*` key (diff en.json vs origin/main). Dispatch 8 parallel READ/translate agents (one per locale — this is the ALLOWED parallel case: independent files, coordinator commits). Each translates from the manifest, preserves `{placeholders}`, keeps key sets identical.
- [ ] Verify parity (all 9 locales same key set) + zero untranslated + `bunx tsc --noEmit` + `bun run test` + `CI=true bun run build`. Commit — `feat(i18n): subtitle-studio strings across all 9 locales`.

### Task 17: Final gates, whole-branch review, PR

- [ ] Full gates: `bun run validate` · `bun run lint` · `bunx tsc --noEmit` · `bun run test` · `CI=true bun run build` · `CI=true bun run e2e:smoke`; full suite under `LC_ALL=en_US.UTF-8 TZ=UTC`.
- [ ] Whole-branch review on the most capable model (integration seams: the extracted decoder/SRT shared with AudioTranscriber must not change its output; faithful-preview holds; envelope gating; self-hosted-no-CDN; the 4 registration points; honesty copy). Fix Critical/Important; re-review.
- [ ] Manual browser smoke (Task-12 flow) once more on the final branch.
- [ ] Open PR against main. Body: what it is, the burn envelope + honest export disclosure, the new JASSUB dependency, no wave numbers / AI footers.

---

## Self-Review

- **Spec coverage:** faithful-preview + Path B (T1,T5,T6,T10); spike-first (T1); cue model + SRT/VTT (T2,T3); ASS incl. karaoke/animation (T4); JASSUB self-hosted (T1,T5); burn + envelope (T6); shared decoder/SRT extraction w/o breaking AudioTranscriber (T2); UI panels (T7–T11); real-browser faithful-preview proof (T12); plumbing + 4 registration points (T7,T13,T14); 9-locale (T7 placeholders, T16 translate); SEO en+ar (T13); OG+e2e (T14); blog + ToolCTA (T15); gates/review/PR (T17). All spec sections mapped.
- **Placeholder scan:** algorithmic tasks (2,3,4,6) carry real failing tests + code; the two genuine unknowns (caption-layer handoff format, output codec/memory ceiling) are explicitly Task-1 spike OUTPUTS that later tasks consume verbatim — not open TODOs.
- **Type consistency:** `Word`/`Cue`/`CueDoc`, `srtTime/vttTime/buildSrt/buildVtt`, `fromWhisperWords/splitCue/mergeCues/retime/shiftAll`, `CaptionStyle`/`PRESETS`, `toAss`/`hexToAssColor`, `mountPreview`/`JassubHandle`, `burnMp4`/`envelopeStatus`/`EXPORT_LIMITS`, `decodeToMono16k` are used identically across producing and consuming tasks.
