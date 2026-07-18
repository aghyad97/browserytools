# Wave 5 — Subtitle Studio burn-in spike findings

Date: 2026-07-18
Status: **PROVEN** — end-to-end captioned MP4 produced in-browser with zero
external/CDN fetches on the burn-in path.

## Goal

Prove the risky path before building UI: **JASSUB (in-browser libass)
rasterizes ASS subtitles → transparent caption layer → the existing self-hosted
`@ffmpeg/ffmpeg` (ffmpeg.wasm) composites that layer onto the video with the
`overlay` filter → playable burned-in MP4.**

Verified on a throwaway 5 s / 1280×720 / 24 fps testsrc2 clip (h264 + aac) with a
2-line ASS subtitle. Driven headlessly via `playwright-core` (Chromium) against
`bun run dev`, capturing all network requests and the ffmpeg log. Output MP4 was
saved and each caption line confirmed visually by extracting frames.

## Verdict: the handoff format

**Image sequence of transparent PNGs** — NOT a transparent video.

- JASSUB renders each caption frame to its canvas; we extract each frame as a
  transparent PNG (`cap%04d.png`) and feed the whole sequence to ffmpeg via the
  `image2` demuxer as a second input.
- Transparent *video* was rejected: the self-hosted core cannot mux the alpha
  codecs that matter here cleanly in MEMFS (prores4444 / qtrle are absent;
  vp9-alpha exists via libvpx but webm-in-MEMFS overlay is more fragile). PNG
  sequence is simple, lossless in the alpha channel, and proven.

## The EXACT ffmpeg args (proven working)

```
-i input.mp4
-framerate 24 -start_number 0 -i cap%04d.png
-filter_complex [0:v][1:v]overlay=0:0:format=auto
-c:v libx264 -preset ultrafast -pix_fmt yuv420p
-c:a copy -shortest
output.mp4
```

- `[0:v]` = source video, `[1:v]` = the PNG caption sequence (rgba). Overlay
  respects the PNG alpha, so only the text pixels are composited.
- `-framerate`/`-start_number` are **input** options and must precede
  `-i cap%04d.png`. Caption PNGs are numbered from `cap0000.png`.
- `-c:a copy` passes the source audio through untouched. `-shortest` guards
  against the image sequence being a hair longer than the video.
- For a lower-fps caption layer (see memory note), set `-framerate <capFps>` on
  the PNG input; overlay's framesync holds each caption frame until the next.

## Real output codec / container

| Field | Value |
|---|---|
| Container | MP4 (`isom` / `isomiso2avc1mp41`) |
| Video | H.264 (libx264, Constrained Baseline @ `-preset ultrafast`), yuv420p, 1280×720, 24 fps |
| Audio | AAC-LC, copied verbatim from source (44.1 kHz mono here) |
| Size | 3.59 MB for the 5 s clip |

Frames extracted at t=1 s ("SUBTITLE STUDIO SPIKE") and t=3 s ("Burn-in via
JASSUB + ffmpeg overlay") both show the burned-in caption with correct JASSUB ASS
styling (bold Liberation Sans, white fill, dark outline) and correct timing (the
two dialogue events switch at 2.4 s).

## Timing + memory (5 s / 720p / 24 fps → 120 frames)

| Stage | Time |
|---|---|
| JASSUB init (worker + wasm load + `ready`) | ~150 ms |
| Caption render: 120 × 720p PNG (render + canvas readback + encode) | ~1270 ms (~10.6 ms/frame) |
| ffmpeg core load (`getFFmpeg`) | ~1090 ms (one-time, cached) |
| ffmpeg overlay + x264 encode (120 frames) | ~2600 ms (~1.96× realtime) |
| **Total pipeline** | **~5.2 s** |

### Extrapolation to 30 s / 720p / 24 fps (720 frames)

- Caption render: ~720 × 10.6 ms ≈ **7.6 s**.
- Overlay+encode at ~1.96× realtime ≈ **15–16 s**.
- Plus one-time inits (~1.2 s) → **~24 s total** for a 30 s 720p clip. Acceptable.

### Hard memory ceiling

The self-hosted ffmpeg core (`getHeapMax()` = **2 GiB**) is the wall. Everything
lives in the wasm MEMFS heap simultaneously: the full input MP4 + the full output
MP4 + all caption PNGs + x264 working buffers.

- Caption PNGs are *mostly transparent*, so they compress small (empty frames a
  few KB; text frames tens of KB), NOT the ~230 KB of an opaque frame — so at
  720p the PNG set is not the bottleneck for a 30 s clip (well under 300 MB total).
- The naive "hold every PNG in a JS array, then write all to MEMFS" scales
  linearly with frame count. For **multi-minute / 1080p** clips this approaches
  the 2 GiB ceiling (input+output both fully resident + thousands of frames).
- **Practical safe envelope (this approach): ~10 min @ 720p or ~3–5 min @ 1080p.**
  Beyond that, the build WILL OOM-abort.

### Production mitigations (for the real feature, not this spike)

1. **Lower the caption-layer fps.** Subtitles change at word/line boundaries, not
   per video frame. Rendering the PNG layer at ~5–8 fps (or only at subtitle
   event boundaries) and letting `overlay` hold frames cuts frame count ~3–5×
   with no visible quality loss.
2. **Stream frames to MEMFS and drop JS references** as they are written, instead
   of buffering all PNGs in a JS array.
3. **Segment long clips** and concat, to keep peak MEMFS bounded.

## Gotchas discovered

1. **Reading pixels off the JASSUB canvas.** JASSUB calls
   `canvas.transferControlToOffscreen()` and hands the canvas to its worker, so
   the main thread CANNOT `getImageData()` on it. The working handoff:
   `await instance.manualRender({ mediaTime, width, height, expectedDisplayTime })`
   (its promise resolves *after* the worker's `_draw`), then
   `readCtx.drawImage(jassubCanvas, 0, 0)` onto a separate 2-D canvas and
   `toBlob('image/png')`. Drawing the transferred placeholder canvas as an image
   source works in Chromium and yields the correct transparent bitmap
   (confirmed: t=1 s caption frame had 29,709 non-transparent pixels).
   The **first** `manualRender` only triggers a resize (no draw) — do one warm-up
   call before the capture loop.
2. **The JASSUB worker must be BUNDLED.** `node_modules/jassub/dist/worker/worker.js`
   is an ESM module with bare imports (`abslink`, `lfa-ponyfill`) + relative
   renderer/emscripten-glue imports — it will not load as a static module worker.
   `scripts/copy-jassub.mjs` bundles it into a single self-contained ESM file via
   `Bun.build` (110 KB), with `external: ['*.wasm']` so the wasm cores stay
   separate static files. JASSUB instantiates the worker as `type: 'module'`, so
   the bundle must be ESM. (Because it uses `Bun.build`, the copy step runs under
   `bun`, not `node` — wired as `bun scripts/copy-jassub.mjs` in `copy-assets`.)
3. **Self-hosted URLs are passed explicitly** to the constructor: `workerUrl`,
   `wasmUrl`, `modernWasmUrl` (SIMD; JASSUB auto-selects it when supported), and
   `availableFonts` keyed lowercase `'liberation sans'` → `/jassub/default.woff2`
   (matches JASSUB's `defaultFont`). A harmless debug line
   `fontselect: failed to find any fallback with glyph 0x0` appears but text
   renders correctly.
4. **`fetchFile()` mangles a `Uint8Array`.** Passing raw bytes through
   `@ffmpeg/util`'s `fetchFile` corrupted the MP4 ("moov atom not found"). When
   you already have the bytes, write them straight to `ffmpeg.writeFile(name, u8)`.
   Reserve `fetchFile` for `File`/`Blob`/URL inputs (as `CompressVideo.tsx` does).
5. **The stock core already HAS libass.** The self-hosted `@ffmpeg/core@0.12.10`
   reports ffmpeg 5.1.4 built with `--enable-libass --enable-libfreetype
   --enable-libfribidi` (also libx265, libvpx, libwebp, libzimg). So a direct
   `subtitles`/`ass` filter path is *technically* available — but it needs
   fontconfig + fonts inside MEMFS (the historically painful path). **JASSUB +
   overlay is still the recommended path**: JASSUB embeds libass + fonts in the
   browser, sidestepping all fontconfig/font-provisioning pain, and keeps the
   burn-in a pure pixel composite.
6. **`overlay` runs in RGBA** — ffmpeg logs `No accelerated colorspace conversion
   from yuv420p to rgba` (a perf note, not an error). Harmless with `-pix_fmt
   yuv420p` on output.
7. **ffmpeg.wasm prints `Aborted()` after a successful exec.** The output was
   fully muxed and `readFile('output.mp4')` succeeded regardless. (Same singleton
   pattern `CompressVideo.tsx` already relies on.)
8. **Next.js App Router private folders:** a route under `src/app/_foo/` (leading
   underscore) is non-routable → 404. Spike-only detail; irrelevant to the real
   tool route.

## No-CDN proof

Network capture over the full run — every burn-in asset was same-origin
(`http://localhost:3500/...`):

```
fetch  /_spike/test.ass
fetch  /_spike/test.mp4
script /jassub/jassub-worker.bundle.js
fetch  /jassub/jassub-worker-modern.wasm   (SIMD core auto-selected)
fetch  /jassub/default.woff2               (Liberation Sans fallback font)
fetch  /ffmpeg/ffmpeg-core.js
fetch  /ffmpeg/ffmpeg-core.wasm
```

The ONLY non-localhost request in the whole page was
`https://va.vercel-scripts.com/v1/script.debug.js` — that is `@vercel/analytics`,
loaded app-globally on every page in dev (it explicitly sends no data in dev and
is first-party via `/_vercel/insights` in prod). It is **not** part of the
subtitle burn-in pipeline. The caption path itself is 100% self-hosted.

## Self-hosting mechanics (kept)

- `scripts/copy-jassub.mjs` — bundles the worker + copies the two wasm cores
  (`jassub-worker.wasm` non-SIMD, `jassub-worker-modern.wasm` SIMD) + the default
  woff2 into `public/jassub/`. Mirrors `scripts/copy-ffmpeg.mjs`.
- Wired into the `copy-assets` npm script (runs on `predev`/`prebuild`/
  `postinstall`), invoked with `bun` because it uses `Bun.build`.
- `public/jassub/` is git-ignored (like `public/ffmpeg/` and `public/tesseract/`)
  — 4 MB of wasm regenerated at install/build, not committed.
- `jassub@2.5.7` added to dependencies.
