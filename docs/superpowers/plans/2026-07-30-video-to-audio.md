# Video to Audio Converter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Batch video→audio extraction at `/tools/video-to-audio` — drop multiple videos, pick format (MP3/M4A/OGG/WAV) + bitrate, optionally trim each file, convert sequentially with per-file progress, download results. Closes GitHub issue #51.

**Architecture:** Reuses the shared ffmpeg.wasm singleton (`getFFmpeg()` from `src/lib/media/ffmpeg.ts`) exactly as CompressVideo does (caller-owned progress listeners, token guard against stale results). New pure helper `parseTimeInput` for trim fields. Queue is plain component state processed by a sequential async loop.

**Tech Stack:** Next.js 15 (webpack build), React 18, TypeScript, ffmpeg.wasm (existing dep — nothing new), next-intl, Vitest + RTL (happy-dom).

**Spec:** `docs/superpowers/specs/2026-07-30-video-to-audio-and-totp-design.md`

## Global Constraints

- Branch: `feat/video-to-audio` off `main`; work in a worktree; always `git -C <worktree>` (shell cwd resets between commands).
- No `Co-Authored-By`, no "Generated with Claude Code" footers on commits or PR. Minimal PR body: one-paragraph summary + `Closes #51`.
- next-intl `t()` takes **literal string keys only** — never `t(variable)`.
- New-tool checklist: BOTH namespaces (`Tools.VideoToAudio` + `ToolsConfig.tools.video-to-audio`) in **all 9 locale files**: `en, ar, es, pt-BR, fr, de, ru, id, zh-CN`.
- ffmpeg singleton contract: attach `ffmpeg.on("progress", cb)` before each `exec`, detach with `.off` in `finally` (listeners stack across the cached instance otherwise).
- Tests: `bun run test` (ffmpeg fully mocked — the CompressVideo.test.tsx mock is the canonical pattern). Build gate: `CI=true bun run build` (webpack — never Turbopack).
- No single-edge borders/accent bars in any UI.

---

### Task 1: Trim-time parser — `src/lib/media/time.ts`

**Files:**
- Create: `src/lib/media/time.ts`
- Create: `src/__tests__/lib/media-time.test.ts`

**Interfaces:**
- Produces: `parseTimeInput(input: string): number | null` — accepts plain seconds (`"90"`, `"90.5"`), `mm:ss` (`"1:30"`), and `hh:mm:ss` (`"01:02:03"`); returns total seconds. Returns `null` both for empty/whitespace input ("not set") and for unparseable input; callers distinguish the two by checking `input.trim() !== ""` (non-empty + `null` = validation error).

- [ ] **Step 1: Write the failing tests**

```ts
// src/__tests__/lib/media-time.test.ts
import { describe, it, expect } from "vitest";
import { parseTimeInput } from "@/lib/media/time";

describe("parseTimeInput", () => {
  it("parses plain seconds, including decimals", () => {
    expect(parseTimeInput("90")).toBe(90);
    expect(parseTimeInput("90.5")).toBe(90.5);
    expect(parseTimeInput("0")).toBe(0);
  });
  it("parses mm:ss and hh:mm:ss", () => {
    expect(parseTimeInput("1:30")).toBe(90);
    expect(parseTimeInput("01:02:03")).toBe(3723);
    expect(parseTimeInput("0:05")).toBe(5);
  });
  it("returns null for empty or whitespace input", () => {
    expect(parseTimeInput("")).toBeNull();
    expect(parseTimeInput("   ")).toBeNull();
  });
  it("returns null for garbage", () => {
    expect(parseTimeInput("abc")).toBeNull();
    expect(parseTimeInput("1:2:3:4")).toBeNull();
    expect(parseTimeInput("1:-5")).toBeNull();
    expect(parseTimeInput("1:75")).toBeNull(); // seconds part must be < 60 when minutes given
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/__tests__/lib/media-time.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/media/time.ts
/**
 * Parse a user-entered time ("90", "90.5", "1:30", "01:02:03") into seconds.
 * Returns null when the input is empty or unparseable — callers treat
 * non-empty-but-null as a validation error.
 */
export function parseTimeInput(input: string): number | null {
  const s = input.trim();
  if (s === "") return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  const parts = s.split(":");
  if (parts.length < 2 || parts.length > 3) return null;
  if (!parts.every((p) => /^\d+(\.\d+)?$/.test(p))) return null;
  const nums = parts.map(Number);
  // Sub-unit fields must stay under 60 (the leading field is unbounded).
  if (nums.slice(1).some((n) => n >= 60)) return null;
  return nums.reduce((acc, n) => acc * 60 + n, 0);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test src/__tests__/lib/media-time.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git -C <worktree> add src/lib/media/time.ts src/__tests__/lib/media-time.test.ts
git -C <worktree> commit -m "feat(video-to-audio): trim-time input parser"
```

---

### Task 2: `VideoToAudio` component + page + tools-config + EN/AR strings

**Files:**
- Create: `src/components/VideoToAudio.tsx`
- Create: `src/app/tools/video-to-audio/page.tsx`
- Create: `src/app/tools/video-to-audio/opengraph-image.tsx`
- Create: `src/app/tools/video-to-audio/twitter-image.tsx`
- Modify: `src/lib/tools-config.ts` (Media Tools items, after Subtitle Studio order 7)
- Modify: `messages/en.json`, `messages/ar.json`
- Create: `src/__tests__/components/VideoToAudio.test.tsx`

**Interfaces:**
- Consumes: `getFFmpeg` from `@/lib/media/ffmpeg`; `fetchFile` from `@ffmpeg/util` (dynamic import); `parseTimeInput` from `@/lib/media/time`; `ToolShell`, `FileDropzone`, `SettingsCard`/`OptionRow`, `Progress`, `Select`, `Button`, `downloadUrl`, `formatBytes`, `toast`.
- Produces: default export `VideoToAudio` client component.

**Format table (module-level const):**

```ts
const FORMAT_OPTIONS = [
  { value: "mp3", codec: "libmp3lame", mime: "audio/mpeg", bitrate: true },
  { value: "m4a", codec: "aac", mime: "audio/mp4", bitrate: true },
  { value: "ogg", codec: "libvorbis", mime: "audio/ogg", bitrate: true },
  { value: "wav", codec: "pcm_s16le", mime: "audio/wav", bitrate: false },
] as const;
const BITRATE_OPTIONS = ["128k", "192k", "256k", "320k"] as const; // default "192k"
```

**Queue item shape (component-local):**

```ts
interface QueueItem {
  id: string;               // crypto.randomUUID()
  file: File;
  name: string;
  size: number;
  status: "queued" | "converting" | "done" | "error";
  progress: number;         // 0-100
  trimStart: string;        // raw user input, "" = unset
  trimEnd: string;
  trimOpen: boolean;        // expandable trim section
  trimError: boolean;       // start/end invalid or start >= end
  outputUrl: string | null; // object URL when done
  outputName: string | null;
  errorKey: "noAudio" | "convertFailed" | null;
}
```

**Behavior (implement exactly):**

- **Dropzone** always visible above the queue (shrinks once files exist): `FileDropzone` with `multiple`, `accept={{ "video/*": [".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"] }}`. Per-file size cap 500 MB (`toast.error(t("videoTooLarge"))`, skip that file). Dropped files append `QueueItem`s (status `queued`). Hidden `<input type="file" multiple>` fallback wired the same way as CompressVideo's.
- **Settings bar** (`SettingsCard`): format `Select` (labels from the const — literal values, safe to render directly) and bitrate `Select`, bitrate disabled when the chosen format has `bitrate: false`. Both disabled while converting.
- **Queue rows:** name (truncate) + `formatBytes(size)` (`dir="ltr"`), status chip, `Progress` bar while converting, trim toggle button revealing two labelled inputs (`t("trimStart")`, `t("trimEnd")`, placeholder `mm:ss`), remove button (idle only), download button when `done`.
- **Trim validation** runs on convert, per file: both fields parse via `parseTimeInput` (empty = unset = valid); if either non-empty field parses `null`, or both set with `start >= end`, mark `trimError`, set status `error` with inline `t("invalidTrim")`, and continue with the next file.
- **Convert all** (primary button, disabled when queue empty or already running):
  1. `cancelRef.current = false`; `runTokenRef.current += 1` (token guard, CompressVideo pattern — a stale run must never write into a cleared/reloaded queue).
  2. `const { fetchFile } = await import("@ffmpeg/util"); const ffmpeg = await getFFmpeg();` — load failure → `toast.error(t("engineLoadFailed"))`, all files back to `queued`, button re-enabled (loader clears its cache so retry works).
  3. Sequential `for` loop over items with status `queued`:
     - skip/stop if `cancelRef.current`
     - validate trim (above); on error continue
     - set status `converting`, progress 0; attach progress listener mapping `{progress}` → that row (guard with run token); write input as `input_<i>.<origExt>` (`fetchFile(item.file)`)
     - build args:
       ```ts
       const fmt = FORMAT_OPTIONS.find((f) => f.value === format)!;
       const args = [
         "-i", inputName,
         ...(start !== null ? ["-ss", String(start)] : []),
         ...(end !== null ? ["-to", String(end)] : []),
         "-vn",
         "-c:a", fmt.codec,
         ...(fmt.bitrate ? ["-b:a", bitrate] : []),
         outputName, // `output_<i>.<fmt.value>`
       ];
       ```
       (`-ss`/`-to` as **output options** — placed after `-i` — for sample-accurate audio trims.)
     - `exec`, `readFile`, then `new Blob([bytes.buffer], { type: fmt.mime })` → object URL onto the row (`status: "done"`, `outputName = base + "." + fmt.value`); failure → `status: "error"`, `errorKey: "convertFailed"` (a zero-byte/failed read means no usable audio → `"noAudio"` when `readFile` returns length 0 or `exec` throws after demux errors — implement simply: `exec` throw ⇒ `convertFailed` unless output missing ⇒ `noAudio`; keeping both keys lets copy stay honest), **continue the loop**
     - `finally` per file: detach the progress listener; `ffmpeg.deleteFile(inputName)` and `ffmpeg.deleteFile(outputName)` in try/catch (bounds peak memory to one file)
  4. Loop end: `setConverting(false)`.
- **Cancel:** while running, the button becomes `t("cancel")` → sets `cancelRef.current = true` and shows `t("finishingCurrent")` hint (ffmpeg.wasm exec is not interruptible mid-file — accepted limitation from the spec). Remaining `queued` files stay queued.
- **Downloads:** per-row `downloadUrl(item.outputUrl, item.outputName)`. Object URLs revoked on row removal and on unmount (single `useEffect` cleanup iterating a ref of live URLs).
- **Adding files while idle after a run** is allowed; "Convert all" only processes `queued` rows (done rows keep their downloads).

**tools-config entry** (Media Tools, after Subtitle Studio):

```ts
{
  name: "Video to Audio",
  href: "/tools/video-to-audio",
  icon: Music4Icon,
  available: true,
  order: 8,
  creationDate: "2026-07-30",
  description:
    "Extract audio from videos in your browser — MP4, MOV, MKV, AVI or WebM in, MP3, M4A, OGG or WAV out. Batch convert, pick the bitrate, optionally trim. No uploads.",
},
```

(Match the file's actual lucide import style for `Music4Icon`/`Music4`.)

**Page files** — compress-video pattern with slug swapped (`page.tsx` imports `VideoToAudio` + `generateToolMetadata("/tools/video-to-audio")`; `opengraph-image.tsx`/`twitter-image.tsx` call `generateToolOgImage("video-to-audio")` with alt `"video-to-audio | BrowseryTools"`).

**EN strings** (`messages/en.json`):

`ToolsConfig.tools.video-to-audio`:
```json
{ "name": "Video to Audio", "description": "Extract audio from videos in your browser — MP4, MOV, MKV, AVI or WebM in, MP3, M4A, OGG or WAV out. Batch convert, pick the bitrate, optionally trim. No uploads." }
```

`Tools.VideoToAudio`:
```json
{
  "dropVideosHere": "Drop your videos here",
  "supportedFormats": "MP4, MOV, WebM, MKV, AVI — multiple files welcome",
  "addMore": "Add more",
  "videoTooLarge": "File too large (max 500 MB) — skipped",
  "format": "Audio format",
  "bitrate": "Bitrate",
  "convertAll": "Convert all",
  "converting": "Converting…",
  "cancel": "Cancel",
  "finishingCurrent": "Finishing the current file, then stopping…",
  "statusQueued": "Queued",
  "statusConverting": "Converting",
  "statusDone": "Done",
  "statusError": "Failed",
  "trim": "Trim",
  "trimStart": "Start",
  "trimEnd": "End",
  "trimPlaceholder": "mm:ss",
  "invalidTrim": "Invalid trim — check the times (start must be before end).",
  "noAudio": "No audio track found or unsupported format.",
  "convertFailed": "Conversion failed for this file.",
  "engineLoadFailed": "Couldn't load the conversion engine. Check your connection and try again.",
  "remove": "Remove",
  "download": "Download",
  "emptyQueueHint": "Files you add will appear here."
}
```

**AR strings** (`messages/ar.json`) — same keys, native Arabic:

```json
{
  "dropVideosHere": "أسقط ملفات الفيديو هنا",
  "supportedFormats": "MP4 وMOV وWebM وMKV وAVI — يمكنك إضافة عدة ملفات",
  "addMore": "إضافة المزيد",
  "videoTooLarge": "الملف كبير جداً (الحد الأقصى 500 م.ب) — تم تخطيه",
  "format": "صيغة الصوت",
  "bitrate": "معدل البت",
  "convertAll": "تحويل الكل",
  "converting": "جارٍ التحويل…",
  "cancel": "إلغاء",
  "finishingCurrent": "سيتوقف التحويل بعد إنهاء الملف الحالي…",
  "statusQueued": "في الانتظار",
  "statusConverting": "جارٍ التحويل",
  "statusDone": "تم",
  "statusError": "فشل",
  "trim": "قصّ",
  "trimStart": "البداية",
  "trimEnd": "النهاية",
  "trimPlaceholder": "mm:ss",
  "invalidTrim": "قيم القصّ غير صالحة — تأكد من الأوقات (يجب أن تسبق البداية النهاية).",
  "noAudio": "لا يوجد مسار صوتي في الملف أو الصيغة غير مدعومة.",
  "convertFailed": "فشل تحويل هذا الملف.",
  "engineLoadFailed": "تعذّر تحميل محرك التحويل. تحقق من اتصالك وحاول مجدداً.",
  "remove": "إزالة",
  "download": "تنزيل",
  "emptyQueueHint": "ستظهر الملفات التي تضيفها هنا."
}
```

- [ ] **Step 1: Write the failing component tests**

```tsx
// src/__tests__/components/VideoToAudio.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoToAudio from "@/components/VideoToAudio";

// Canonical ffmpeg mock — CompressVideo.test.tsx pattern.
let progressHandler: ((e: { progress: number }) => void) | null = null;
const load = vi.fn().mockResolvedValue(undefined);
const writeFile = vi.fn().mockResolvedValue(undefined);
const exec = vi.fn().mockImplementation(async () => {
  progressHandler?.({ progress: 1 });
});
const readFile = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]));
const deleteFile = vi.fn().mockResolvedValue(undefined);

vi.mock("@ffmpeg/ffmpeg", () => ({
  FFmpeg: class {
    on(event: string, cb: (e: { progress: number }) => void) {
      if (event === "progress") progressHandler = cb;
    }
    off() {
      progressHandler = null;
    }
    load = load;
    writeFile = writeFile;
    exec = exec;
    readFile = readFile;
    deleteFile = deleteFile;
  },
}));
vi.mock("@ffmpeg/util", () => ({
  toBlobURL: vi.fn().mockResolvedValue("blob:mock-core"),
  fetchFile: vi.fn().mockResolvedValue(new Uint8Array([0])),
}));

beforeEach(() => {
  progressHandler = null;
  [load, writeFile, exec, readFile, deleteFile].forEach((f) => f.mockClear());
  exec.mockImplementation(async () => {
    progressHandler?.({ progress: 1 });
  });
});

function makeFile(name: string) {
  return new File(["x".repeat(100)], name, { type: "video/mp4" });
}

async function uploadFiles(container: HTMLElement, names: string[]) {
  const user = userEvent.setup();
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  await user.upload(input, names.map(makeFile));
  for (const n of names) await screen.findByText(n);
  return user;
}

describe("VideoToAudio", () => {
  it("renders dropzone and disabled convert button when empty", () => {
    render(<VideoToAudio />);
    expect(screen.getByText(/drop your videos here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /convert all/i })).toBeDisabled();
  });

  it("queues multiple files and converts them sequentially", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4", "b.mov"]);
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(2));
    // Both rows expose a download button once done.
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /download/i })).toHaveLength(2)
    );
    // Inputs and outputs cleaned from ffmpeg FS after each file.
    expect(deleteFile).toHaveBeenCalledTimes(4);
  });

  it("passes -vn and the selected codec/bitrate to ffmpeg", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4"]);
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    expect(args).toContain("-vn");
    expect(args).toContain("libmp3lame"); // mp3 default
    expect(args).toContain("-b:a");
    expect(args).toContain("192k"); // default bitrate
  });

  it("applies trim times as -ss/-to output options", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4"]);
    await user.click(screen.getByRole("button", { name: /trim/i }));
    await user.type(screen.getByLabelText(/start/i), "0:10");
    await user.type(screen.getByLabelText(/end/i), "1:00");
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    const ssIdx = args.indexOf("-ss");
    expect(ssIdx).toBeGreaterThan(args.indexOf("-i")); // output option
    expect(args[ssIdx + 1]).toBe("10");
    expect(args[args.indexOf("-to") + 1]).toBe("60");
  });

  it("marks a file with start >= end as error and still converts the rest", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["bad.mp4", "good.mp4"]);
    const badRow = screen.getByText("bad.mp4").closest("li") as HTMLElement;
    await user.click(within(badRow).getByRole("button", { name: /trim/i }));
    await user.type(within(badRow).getByLabelText(/start/i), "2:00");
    await user.type(within(badRow).getByLabelText(/end/i), "1:00");
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() =>
      expect(screen.getByText(/invalid trim/i)).toBeInTheDocument()
    );
    // Only the good file reached ffmpeg, and it completed.
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /download/i })).toHaveLength(1)
    );
  });

  it("continues the queue when one file fails to convert", async () => {
    exec
      .mockImplementationOnce(async () => {
        throw new Error("demux failed");
      })
      .mockImplementationOnce(async () => {
        progressHandler?.({ progress: 1 });
      });
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["broken.avi", "fine.mp4"]);
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/failed/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /download/i })).toHaveLength(1)
    );
  });

  it("disables bitrate select when WAV is chosen", async () => {
    const { container } = render(<VideoToAudio />);
    await uploadFiles(container, ["a.mp4"]);
    const user = userEvent.setup();
    // Radix Select: open format select and choose WAV.
    await user.click(screen.getByLabelText(/audio format/i));
    await user.click(await screen.findByRole("option", { name: /wav/i }));
    expect(screen.getByLabelText(/bitrate/i)).toBeDisabled();
  });

  it("removes a queued file and revokes nothing prematurely", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4"]);
    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(screen.queryByText("a.mp4")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /convert all/i })).toBeDisabled();
  });
});
```

Notes for the implementer: queue rows render as `<li>` inside a `<ul>` (the `closest("li")` in tests depends on it). Radix Select needs `hasPointerCapture` stubbed — already in `src/test-setup.ts`. Give format/bitrate `SelectTrigger`s ids wired to `OptionRow`'s `htmlFor` so `getByLabelText` resolves.

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/__tests__/components/VideoToAudio.test.tsx`
Expected: FAIL — component not found.

- [ ] **Step 3: Implement component, pages, tools-config, EN+AR strings**

Follow the behavior spec above; mirror CompressVideo's idioms (object-URL hygiene, token guard, `dir="ltr"` on numbers, logical margins, listener detach in `finally`).

- [ ] **Step 4: Run the full suite**

Run: `bun run test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git -C <worktree> add src/components/VideoToAudio.tsx src/app/tools/video-to-audio/ src/lib/tools-config.ts messages/en.json messages/ar.json src/__tests__/components/VideoToAudio.test.tsx
git -C <worktree> commit -m "feat(video-to-audio): batch video-to-audio converter on shared ffmpeg.wasm"
```

---

### Task 3: Remaining 7 locales

**Files:**
- Modify: `messages/es.json`, `messages/pt-BR.json`, `messages/fr.json`, `messages/de.json`, `messages/ru.json`, `messages/id.json`, `messages/zh-CN.json`

**Interfaces:**
- Consumes: the exact key sets from Task 2 (`Tools.VideoToAudio` — all 25 keys — and `ToolsConfig.tools.video-to-audio`).

- [ ] **Step 1: Add both namespaces to each locale file** — native translations; keep format names (MP3, WAV…), `mm:ss`, and byte units conventional per locale.

- [ ] **Step 2: Verify key parity**

```bash
node -e "
const langs=['en','ar','es','pt-BR','fr','de','ru','id','zh-CN'];
const ref=Object.keys(require('./messages/en.json').Tools.VideoToAudio).sort().join();
for(const l of langs){
  const m=require('./messages/'+l+'.json');
  const k=Object.keys(m.Tools?.VideoToAudio??{}).sort().join();
  if(k!==ref) throw new Error(l+' Tools.VideoToAudio key mismatch');
  if(!m.ToolsConfig?.tools?.['video-to-audio']?.name) throw new Error(l+' missing ToolsConfig entry');
}
console.log('locale parity OK');
"
```
Expected: `locale parity OK`.

- [ ] **Step 3: Run tests + commit**

```bash
bun run test
git -C <worktree> add messages/
git -C <worktree> commit -m "i18n(video-to-audio): strings for all locales"
```

---

### Task 4: Blog posts (EN + AR)

**Files:**
- Modify: `src/lib/blog-data.ts`
- Create: `src/app/blog/posts/video-to-audio-guide.tsx`
- Create: `src/app/blog/posts/video-to-audio-guide-ar.tsx`

- [ ] **Step 1: Add blog-data entries**

```ts
{
  slug: "video-to-audio-guide",
  title: "Convert Video to Audio Free — Extract MP3 from MP4 in Your Browser",
  description:
    "Extract audio from MP4, MOV, MKV, AVI or WebM videos free, with no upload. Batch convert to MP3, M4A, OGG or WAV, pick the bitrate, and trim — all in your browser.",
  date: "2026-07-30",
  author: "BrowseryTools Team",
  category: "Media Tools",
  tags: ["video to audio", "mp4 to mp3", "extract audio from video", "video to mp3 converter", "mkv to mp3", "convert video to wav"],
  readTime: 6,
  featured: true,
  coverEmoji: "🎵",
  coverGradient: "from-violet-500 to-fuchsia-500",
},
{
  slug: "video-to-audio-guide-ar",
  title: "حوّل الفيديو إلى صوت مجاناً — استخرج MP3 من MP4 في متصفحك",
  description:
    "استخرج الصوت من فيديوهات MP4 وMOV وMKV وAVI وWebM مجاناً ودون رفع أي ملف. حوّل دفعة كاملة إلى MP3 أو M4A أو OGG أو WAV مع اختيار معدل البت والقصّ — كل ذلك داخل متصفحك.",
  date: "2026-07-30",
  author: "BrowseryTools Team",
  category: "Media Tools",
  tags: ["تحويل فيديو إلى صوت", "MP4 إلى MP3", "استخراج الصوت من الفيديو"],
  readTime: 6,
  featured: false,
  coverEmoji: "🎵",
  coverGradient: "from-violet-500 to-fuchsia-500",
},
```

- [ ] **Step 2: Write the two post components** (idiom from `audio-transcriber-guide.tsx`). Required coverage, in order:
1. Why extract audio (listening, transcription, sampling, sharing) and why browser-side beats uploading to a converter site (privacy, speed, no size games)
2. Step-by-step batch flow: drop files → pick format/bitrate → optional trim → convert all → download each
3. Choosing a format: MP3 (universal), M4A (Apple ecosystem, better quality/size), OGG (open), WAV (lossless, editing) — one sentence each on bitrate guidance (192k default, 320k for music)
4. Trim tip: `mm:ss` inputs, extracting a clip's audio without re-encoding the whole file
5. Honest limits: big files take time (in-browser encoding), first load fetches the ~31 MB engine once
6. CTA to `/tools/video-to-audio`, cross-link `/tools/compress-video` and `/tools/audio-transcriber`

AR post: native transcreation of the same outline.

- [ ] **Step 3: Verify + commit**

```bash
bun run test
git -C <worktree> add src/lib/blog-data.ts src/app/blog/posts/video-to-audio-guide.tsx src/app/blog/posts/video-to-audio-guide-ar.tsx
git -C <worktree> commit -m "blog(video-to-audio): EN + AR guides"
```

---

### Task 5: Gates + PR

- [ ] **Step 1: Full test suite** — `bun run test` → all pass.
- [ ] **Step 2: Build gate** — `CI=true bun run build` → succeeds (webpack; pre-existing metadata warnings are not blockers).
- [ ] **Step 3: Manual smoke** (dev server): convert a real MP4 and an MKV to MP3 → playable output; WAV disables bitrate; trim `0:05`–`0:10` yields ~5s audio; a corrupt file errors while the rest of the batch completes; cancel stops after the in-flight file; RTL (ar) sane.
- [ ] **Step 4: Push + PR**

```bash
git -C <worktree> push -u origin feat/video-to-audio
gh pr create --title "Add Video to Audio converter tool" --body "Adds /tools/video-to-audio — batch audio extraction from video files on the shared ffmpeg.wasm engine: MP3/M4A/OGG/WAV output, bitrate selection, optional per-file trim, sequential queue with per-file progress and errors. All locales + EN/AR blog posts.

Closes #51"
```
(No AI footers, no Co-Authored-By.)
