# Design: Video to Audio Converter + TOTP Generator

**Date:** 2026-07-30
**Source:** GitHub issues [#51](https://github.com/aghyadalbalkhi/browserytools/issues/51) (Video to Audio) and [#50](https://github.com/aghyadalbalkhi/browserytools/issues/50) (offline TOTP generator)
**Status:** Approved by Aghyad 2026-07-30

Two independent client-side tools. They share no code beyond existing site
infrastructure, but ship together as one planning cycle.

---

## Tool 1 — Video to Audio Converter

**Route:** `/tools/video-to-audio` · **Component:** `src/components/VideoToAudio.tsx`
**Category:** Media Tools (`mediaTools`), order 8 · **Icon:** `Music4Icon` (lucide)

### Purpose

Extract the audio track from video files entirely in the browser. Batch queue:
drop several videos, convert sequentially, download each result. Optional
per-file trim (issue requirement).

### Engine

Reuses the shared ffmpeg.wasm singleton (`getFFmpeg()` from
`src/lib/media/ffmpeg.ts`) — the same infrastructure as Compress Video. No new
dependencies. Per-file command:

```
-i <input> [-ss <start>] [-to <end>] -vn -c:a <codec> [-b:a <bitrate>] <output>
```

| Output format | Codec        | Bitrate selectable |
| ------------- | ------------ | ------------------ |
| MP3           | `libmp3lame` | yes                |
| M4A           | `aac`        | yes                |
| OGG           | `libvorbis`  | yes                |
| WAV           | `pcm_s16le`  | no (lossless PCM)  |

Bitrate presets: 128 / 192 / 256 / 320 kbps (default 192). Input: any
container ffmpeg.wasm can demux — MP4, MOV, MKV, AVI, WebM. Accept attribute
`video/*` plus explicit `.mkv,.avi` (some platforms report no MIME for these).

### UX

1. **Dropzone** — multi-file, drag & drop + click-to-browse, same pattern as
   existing media tools. Files can be added or removed while the queue is idle.
2. **Global settings bar** — format select + bitrate select (bitrate disabled
   when WAV). Settings apply to the whole batch; no per-file overrides in v1.
3. **Queue list** — one row per file:
   - filename, size, status chip: `queued | converting | done | error`
   - live progress bar during conversion (ffmpeg `progress` event; listener
     attached before `exec`, detached after — singleton contract)
   - expandable **Trim** section: optional start/end `mm:ss` text inputs
     (also accepts `hh:mm:ss` and plain seconds). Validation: parseable,
     start < end. Invalid trim blocks only that file's conversion with an
     inline message. No waveform/preview in v1.
   - **Download** button when done (object URL, revoked on row removal/unmount)
4. **Convert all** — processes the queue strictly sequentially (single ffmpeg
   instance). A per-file failure marks that row `error` with a short message
   and the queue continues. Button becomes **Cancel** during a run; cancel
   stops after the in-flight file (ffmpeg.wasm exec is not interruptible
   mid-file without terminating the instance — accepted limitation, noted in
   UI copy as "finishing current file…").

### Error handling

- ffmpeg load failure → toast + inline retry (the loader clears its cache on
  failure so retry works).
- Un-demuxable / audio-less file → row error "No audio track found or
  unsupported format".
- Memory: files are written to the ffmpeg FS one at a time and deleted
  (input + output) after each file completes, so peak memory is one file's
  input + output, not the whole batch.

### Out of scope (v1)

Per-file format overrides, waveform preview, "download all as ZIP", parallel
conversion.

---

## Tool 2 — TOTP (2FA) Code Generator

**Route:** `/tools/totp-generator` · **Component:** `src/components/TotpGenerator.tsx`
**Category:** Security Tools (`securityTools`), order 6 · **Icon:** `ShieldCheckIcon` (lucide)

### Purpose

A 100% offline, multi-account TOTP authenticator: add accounts by secret,
otpauth URI, or QR screenshot; see live codes with a countdown; optionally
persist accounts on-device.

### Engine — pure WebCrypto, zero dependencies

`src/lib/totp.ts` — framework-free, fully unit-testable:

- `base32Decode(s: string): Uint8Array` — RFC 4648 base32 (case-insensitive,
  ignores spaces/hyphens, accepts unpadded input; throws on invalid chars)
- `generateTotp(secret, opts): Promise<string>` — RFC 6238 via
  `crypto.subtle.importKey` + HMAC (SHA-1 default; SHA-256/SHA-512 supported),
  dynamic truncation, 6 or 8 digits, configurable period (default 30 s) —
  computed from device clock (`Date.now()`)
- `parseOtpauthUri(uri: string): TotpAccount` — parses
  `otpauth://totp/<label>?secret=…&issuer=…&algorithm=…&digits=…&period=…`;
  rejects `otpauth://hotp/` with a clear error

Unit tests use the RFC 6238 Appendix B test vectors (all three algorithms)
plus base32 and URI-parser edge cases.

### QR import

New dependency: `jsqr` (~40 KB, zero deps), dynamically imported only when the
QR tab is used. Flow: image file/paste → draw to canvas → `ImageData` → jsQR →
`parseOtpauthUri`. (The existing QR Scanner component is a stub with no decode
library, and `qrcode` in package.json is generate-only — nothing to reuse.)

`otpauth-migration://` (Google Authenticator batch export, protobuf) is **out
of scope v1**; the parser detects the scheme and shows "export accounts one at
a time" guidance instead of a generic error.

### State & persistence

Zustand store `src/store/totp-store.ts`:

```ts
interface TotpAccount {
  id: string;          // crypto.randomUUID()
  label: string;
  issuer?: string;
  secret: string;      // base32, as entered
  algorithm: "SHA-1" | "SHA-256" | "SHA-512";
  digits: 6 | 8;
  period: number;      // seconds
  persisted: boolean;  // "Save on this device" toggle
}
```

- All accounts live in memory. `persist` middleware with `partialize` writes
  **only accounts with `persisted: true`** to localStorage.
- The per-account toggle shows warning copy: saved secrets are stored
  unencrypted in this browser profile and readable by anyone with access to
  the device. Off by default.
- Deleting an account removes it from memory and (if persisted) storage.

### UX

1. **Trust banner** at the top: runs entirely in the browser, secrets never
   leave the device, works offline after first load.
2. **Account list** — each card: issuer + label, live code grouped for
   readability (`123 456`), countdown ring synced to the account's period,
   one-tap copy (existing clipboard pattern + toast), "Save on this device"
   toggle, delete (with confirm). Codes for all accounts tick from a single
   1 s interval; each recomputes when its own period boundary passes.
   Empty state explains what TOTP is in one sentence + points at the add flow.
3. **Add account** — three tabs:
   - **Manual:** secret (required, validated as base32 on submit), issuer,
     label; collapsed "Advanced" for digits/period/algorithm (defaults
     6 / 30 s / SHA-1 cover virtually all real services)
   - **URI:** paste `otpauth://…`, parsed on submit with inline error
   - **QR image:** upload or paste a screenshot; decoded client-side
4. Duplicate handling: adding an account with identical secret+label prompts
   replace/keep-both.

### Security notes (UI + blog)

Displayed in the tool and covered in the blog post: this is a convenience
tool; a saved secret in localStorage is weaker than a dedicated authenticator
app with OS-level encryption; recommend the toggle stay off on shared
machines. No secret ever appears in a URL, network request, or analytics.

---

## Shared shipping checklist (both tools)

- `src/app/tools/<slug>/page.tsx` importing the component +
  `generateToolMetadata("/tools/<slug>")`
- `tools-config.ts` entry (category/icon/order/creationDate as above)
- i18n in **all 9 locale files** (`en, ar, es, pt-BR, fr, de, ru, id, zh-CN`),
  both namespaces per the new-tool checklist:
  - `Tools.VideoToAudio` / `Tools.TotpGenerator` (component UI strings)
  - `ToolsConfig.tools.video-to-audio` / `ToolsConfig.tools.totp-generator`
    (`name` + `description` — missing these throws `MISSING_MESSAGE` at render)
- Blog posts EN + AR per tool (metadata in `blog-data` files, content in
  `src/app/blog/posts/`)
- Sitemap: driven by tools-config/blog-data, no manual step
- next-intl caveat honored: literal string keys only (no `t(variable)`)

### Testing

- `src/lib/totp.ts`: RFC 6238 Appendix B vectors (SHA-1/256/512), base32
  decoder edge cases, otpauth parser (valid/invalid/hotp/migration schemes)
- `TotpGenerator`: add/copy/delete/persist-toggle flows with fake timers;
  store `partialize` behavior (only persisted accounts written)
- `VideoToAudio`: queue state transitions, trim parsing/validation, error
  continuation, with `@/lib/media/ffmpeg` mocked (CompressVideo test pattern)
- Existing suite stays green; `CI=true bun run build` (webpack, not Turbopack)
  passes

### Delivery

One branch + PR per tool (independent features, independently revertable).
Each PR closes its issue (`Closes #51` / `Closes #50`). Minimal PR bodies per
repo convention.
