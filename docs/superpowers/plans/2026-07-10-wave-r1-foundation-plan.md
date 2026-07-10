# Wave R1: Foundation Refactor + Test Safety Net — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the e2e regression net over all 137 tool routes, extract the shared primitives that 24–75 components currently duplicate, migrate the duplication hotspots onto them, and land the audit's honesty fixes — with zero user-visible breakage.

**Architecture:** Safety net first (auto-generated Playwright smoke suite), then pure libs (`src/lib/*`), then composite components (`src/components/shared/*`), then per-component migrations in small verified batches. Visual redesign is explicitly OUT of scope (that's Wave R2) — every primitive ships styled to match the CURRENT site so migrations are invisible.

**Tech Stack:** Next.js 15/16 (webpack builds — Turbopack deadlocks), TypeScript, Bun, Vitest v4 + React Testing Library (happy-dom), Playwright (chromium/firefox/Pixel 5), react-dropzone, gif.js, sonner.

## Global Constraints

- `bun run build` must use `--webpack` (already in package.json); never switch to Turbopack.
- All **358** existing unit tests (61 files, verified green 2026-07-10) stay green after every task. Run `bun run test` before every commit.
- Vitest configs use `.mts`; environment is happy-dom (jsdom@28 breaks on `@exodus/bytes`).
- Clipboard tests: `vi.spyOn(navigator.clipboard, "writeText")` AFTER userEvent interactions (getter-only mock in `src/test-setup.ts`).
- Toast mocks must be callable AND have methods: `Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn() })`.
- No new i18n keys in this wave except Task 10's description fixes; when touching `messages/*.json` all 9 locales (en, ar, es, pt-BR, fr, de, ru, id, zh-CN) must stay in sync — `validate-tools.js` and TS typecheck enforce it.
- No visual/style changes to any tool in this wave. Primitives replicate current markup/classes.
- Commit after every green task; conventional commits (`feat:`/`refactor:`/`test:`/`fix:`); never add Co-Authored-By lines.

---

### Task 0: Version the docs

**Files:**
- Modify: `.gitignore:44`

**Interfaces:**
- Produces: `docs/superpowers/**` becomes versionable; specs/plans commit with the branch.

- [ ] **Step 1: Add the un-ignore exception**

Replace line 44 (`docs/`) with:

```gitignore
docs/
!docs/superpowers/
!docs/superpowers/**
```

- [ ] **Step 2: Verify git sees the docs**

Run: `git status --short docs/`
Expected: `?? docs/superpowers/...` entries appear.

- [ ] **Step 3: Commit**

```bash
git add .gitignore docs/superpowers
git commit -m "docs: version redesign program spec and R1 plan"
```

---

### Task 1: Auto-generated e2e smoke suite over every tool route

**Files:**
- Create: `scripts/generate-tool-routes.mjs`
- Create: `e2e/tool-routes.json` (generated)
- Create: `e2e/all-tools-smoke.spec.ts`
- Modify: `package.json` (add `pregenerate` convenience script)

**Interfaces:**
- Consumes: `src/lib/tools-config.ts` `tools: ToolCategory[]` (each item has `href`, `name`, `available`).
- Produces: `e2e/tool-routes.json` — `Array<{ href: string; name: string }>`; `bun run e2e:smoke` command used as the gate by every later task.

- [ ] **Step 1: Write the route generator**

`scripts/generate-tool-routes.mjs`:

```js
// Extracts { href, name } for every available tool from tools-config.ts
// without executing it (the file imports lucide-react icons).
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/lib/tools-config.ts", "utf8");
const routes = [];
const re = /name:\s*"([^"]+)",\s*href:\s*"(\/tools\/[^"]+)",[\s\S]*?available:\s*(true|false)/g;
let m;
while ((m = re.exec(src))) {
  if (m[3] === "true") routes.push({ name: m[1], href: m[2] });
}
if (routes.length < 100) {
  console.error(`Only ${routes.length} routes extracted — regex drifted from tools-config format`);
  process.exit(1);
}
writeFileSync("e2e/tool-routes.json", JSON.stringify(routes, null, 2) + "\n");
console.log(`wrote ${routes.length} routes`);
```

- [ ] **Step 2: Run it and verify count**

Run: `node scripts/generate-tool-routes.mjs`
Expected: `wrote 137 routes` (±2 — must match the live tool count, not fewer than 130).

- [ ] **Step 3: Write the smoke spec**

`e2e/all-tools-smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import routes from "./tool-routes.json";

// Console errors that predate this suite and are not tool regressions.
const IGNORED = [
  /was preloaded using link preload/i, // font preload warnings surface as errors in some builds
  /hydration/i, // tracked separately; do not let it mask new breakage — remove once fixed
];

for (const { href, name } of routes) {
  test(`smoke: ${name} (${href})`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !IGNORED.some((re) => re.test(msg.text()))) {
        errors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    const res = await page.goto(href, { waitUntil: "domcontentloaded" });
    expect(res?.status(), "HTTP status").toBeLessThan(400);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
    expect(errors, `console errors on ${href}`).toEqual([]);
  });
}
```

- [ ] **Step 4: Add the script and run the suite (chromium only for speed)**

In `package.json` scripts add:

```json
"e2e:routes": "node scripts/generate-tool-routes.mjs",
"e2e:smoke": "playwright test e2e/all-tools-smoke.spec.ts --project=chromium"
```

Run: `bun run build && bun run e2e:smoke`
Expected: 137 tests. Record any failures — pre-existing failures get their route added to a `KNOWN_FAILING` skip-list with a code comment naming the reason, so the suite is green-or-explained before refactors start.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-tool-routes.mjs e2e/tool-routes.json e2e/all-tools-smoke.spec.ts package.json
git commit -m "test(e2e): auto-generated smoke suite over all tool routes"
```

---

### Task 2: `src/lib/download.ts` — the one download helper

**Files:**
- Create: `src/lib/download.ts`
- Test: `src/__tests__/lib/download.test.ts`

**Interfaces:**
- Produces:
  - `downloadBlob(blob: Blob, filename: string): void`
  - `downloadUrl(url: string, filename: string): void`
  - `downloadText(text: string, filename: string, mime?: string): void` (default `text/plain;charset=utf-8`)
  - `downloadDataUrl(dataUrl: string, filename: string): void`
- Used by Tasks 4, 5, 6, 7 and all future migrations (replaces 68 hand-rolled anchors).

- [ ] **Step 1: Write the failing tests**

`src/__tests__/lib/download.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadBlob, downloadText, downloadUrl } from "@/lib/download";

describe("download helpers", () => {
  let clicked: HTMLAnchorElement[] = [];
  let createURL: ReturnType<typeof vi.spyOn>;
  let revokeURL: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    clicked = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push(this);
    });
    createURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    revokeURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("downloadBlob creates an object URL, clicks an anchor with the filename, then revokes", () => {
    downloadBlob(new Blob(["x"]), "out.png");
    expect(createURL).toHaveBeenCalledOnce();
    expect(clicked).toHaveLength(1);
    expect(clicked[0].download).toBe("out.png");
    expect(clicked[0].href).toContain("blob:mock-url");
    expect(revokeURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("downloadUrl clicks an anchor pointing at the given url without revoking it", () => {
    downloadUrl("blob:existing", "file.webm");
    expect(clicked[0].download).toBe("file.webm");
    expect(revokeURL).not.toHaveBeenCalled();
  });

  it("downloadText wraps text in a Blob with the given mime", () => {
    downloadText("hello", "notes.txt");
    expect(createURL).toHaveBeenCalledOnce();
    const blob = createURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe("text/plain;charset=utf-8");
    expect(clicked[0].download).toBe("notes.txt");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/__tests__/lib/download.test.ts`
Expected: FAIL — `Cannot find module '@/lib/download'`.

- [ ] **Step 3: Implement**

`src/lib/download.ts`:

```ts
/**
 * Single download pathway for every tool. Replaces the per-component
 * `document.createElement("a")` pattern (68 call sites at extraction time).
 */

function clickAnchor(href: string, filename: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadUrl(url: string, filename: string): void {
  clickAnchor(url, filename);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    clickAnchor(url, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadText(text: string, filename: string, mime = "text/plain;charset=utf-8"): void {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  clickAnchor(dataUrl, filename);
}
```

- [ ] **Step 4: Run tests — expect 3 passing**

Run: `bun run test src/__tests__/lib/download.test.ts`
Expected: PASS (3).

- [ ] **Step 5: Commit**

```bash
git add src/lib/download.ts src/__tests__/lib/download.test.ts
git commit -m "feat(lib): shared download helpers"
```

---

### Task 3: `src/lib/clipboard.ts` + `CopyButton`

**Files:**
- Create: `src/lib/clipboard.ts`
- Create: `src/components/shared/CopyButton.tsx`
- Test: `src/__tests__/lib/clipboard.test.ts`
- Test: `src/__tests__/components/CopyButton.test.tsx`

**Interfaces:**
- Produces:
  - `copyText(text: string): Promise<boolean>` (never throws)
  - `<CopyButton text={string} label?={string} size?="sm"|"icon" />` — button that copies, shows check for 1.5s, fires `toast.success`.
- Replaces the 75 inline `clipboard.writeText` call sites over R1/R2 migrations.

- [ ] **Step 1: Write failing lib test**

`src/__tests__/lib/clipboard.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
import { copyText } from "@/lib/clipboard";

describe("copyText", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns true when the clipboard write succeeds", async () => {
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await expect(copyText("abc")).resolves.toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("abc");
  });

  it("returns false instead of throwing when the write fails", async () => {
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    await expect(copyText("abc")).resolves.toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect module-not-found failure**

Run: `bun run test src/__tests__/lib/clipboard.test.ts`

- [ ] **Step 3: Implement lib**

`src/lib/clipboard.ts`:

```ts
/** Copy text; resolve false on any failure (permissions, no focus). */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run lib tests — PASS (2). Then write the failing component test**

`src/__tests__/components/CopyButton.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const toast = Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn() });
vi.mock("sonner", () => ({ toast }));

import { CopyButton } from "@/components/shared/CopyButton";

describe("CopyButton", () => {
  afterEach(() => vi.restoreAllMocks());

  it("copies the text and toasts success", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="payload" label="Copy result" />);
    const spy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: "Copy result" }));
    expect(spy).toHaveBeenCalledWith("payload");
    expect(toast.success).toHaveBeenCalled();
  });

  it("toasts error when the copy fails", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="payload" />);
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("nope"));
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(toast.error).toHaveBeenCalled();
  });
});
```

- [ ] **Step 5: Implement component (current-site styling: shadcn Button ghost)**

`src/components/shared/CopyButton.tsx`:

```tsx
"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "icon";
}

export function CopyButton({ text, label = "Copy", size = "sm" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (await copyText(text)) {
      toast.success("Copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("Couldn't copy — check clipboard permissions");
    }
  };

  return (
    <Button variant="ghost" size={size} aria-label={label} onClick={onClick}>
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      {size !== "icon" && label}
    </Button>
  );
}
```

- [ ] **Step 6: Run both test files — PASS (4 total). Commit**

```bash
git add src/lib/clipboard.ts src/components/shared/CopyButton.tsx src/__tests__/lib/clipboard.test.ts src/__tests__/components/CopyButton.test.tsx
git commit -m "feat(shared): clipboard lib + CopyButton"
```

---

### Task 4: `src/lib/image/canvas.ts` — one canvas pipeline

**Files:**
- Create: `src/lib/image/canvas.ts`
- Test: `src/__tests__/lib/image-canvas.test.ts`

**Interfaces:**
- Produces:
  - `loadImage(src: string | File | Blob): Promise<HTMLImageElement>`
  - `canvasToBlob(canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob | null>` — **resolves `null` on encode failure, never rejects.** (Verified 2026-07-10: all 10 existing local helpers use this exact contract and every call site has an `if (!blob)` guard — matching it keeps migrations purely mechanical. A throwing wrapper can come with R2 if wanted.)
  - `drawToCanvas(img: CanvasImageSource, width: number, height: number): HTMLCanvasElement`
- Replaces identical private helpers in 10 components (ImageConverter, ImageResizer, MemeGenerator, PhotoCollage, ExifRemover, PhotoCensor, ScreenshotBeautifier, DepthMap, FaviconGenerator, SignatureMaker).

- [ ] **Step 1: Failing tests**

`src/__tests__/lib/image-canvas.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { canvasToBlob, drawToCanvas } from "@/lib/image/canvas";

describe("canvas helpers", () => {
  it("canvasToBlob resolves with the blob from toBlob", async () => {
    const canvas = document.createElement("canvas");
    const blob = new Blob(["img"], { type: "image/png" });
    canvas.toBlob = vi.fn((cb: BlobCallback) => cb(blob));
    await expect(canvasToBlob(canvas, "image/png")).resolves.toBe(blob);
  });

  it("canvasToBlob resolves null when toBlob yields null (matches all existing call-site guards)", async () => {
    const canvas = document.createElement("canvas");
    canvas.toBlob = vi.fn((cb: BlobCallback) => cb(null));
    await expect(canvasToBlob(canvas)).resolves.toBeNull();
  });

  it("drawToCanvas returns a canvas of the requested size", () => {
    const source = document.createElement("canvas");
    const ctxStub = { drawImage: vi.fn() } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctxStub);
    const out = drawToCanvas(source, 120, 80);
    expect(out.width).toBe(120);
    expect(out.height).toBe(80);
    expect(ctxStub.drawImage).toHaveBeenCalledWith(source, 0, 0, 120, 80);
  });
});
```

- [ ] **Step 2: Run — FAIL (module not found)**

- [ ] **Step 3: Implement**

`src/lib/image/canvas.ts`:

```ts
/**
 * Shared canvas plumbing for image tools. Replaces per-component
 * canvasToBlob/loadImage copies (10 components at extraction time).
 */

export function loadImage(src: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = typeof src === "string" ? src : URL.createObjectURL(src);
    const revoke = () => {
      if (typeof src !== "string") URL.revokeObjectURL(url);
    };
    const img = new Image();
    img.onload = () => {
      revoke();
      resolve(img);
    };
    img.onerror = () => {
      revoke();
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Resolves null on encode failure — deliberately matching the contract of
 * all 10 pre-existing local helpers so call-site `if (!blob)` guards keep
 * working unchanged during migration.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality?: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export function drawToCanvas(img: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}
```

- [ ] **Step 4: Run — PASS (3). Commit**

```bash
git add src/lib/image/canvas.ts src/__tests__/lib/image-canvas.test.ts
git commit -m "feat(lib): shared image canvas pipeline"
```

---

### Task 5: Migrate the 10 canvasToBlob components to `lib/image/canvas`

**Files:**
- Modify (batch A): `src/components/ImageConverter.tsx`, `src/components/ImageResizer.tsx`, `src/components/ExifRemover.tsx`, `src/components/SignatureMaker.tsx`, `src/components/FaviconGenerator.tsx`
- Modify (batch B): `src/components/MemeGenerator.tsx`, `src/components/PhotoCollage.tsx`, `src/components/PhotoCensor.tsx`, `src/components/ScreenshotBeautifier.tsx`, `src/components/DepthMap.tsx`

**Interfaces:**
- Consumes: `canvasToBlob`, `loadImage` from Task 4; `downloadBlob` from Task 2.

Per component, the migration is mechanical and identical:

- [ ] **Step 1 (repeat per component): Replace the private helper**

In each file: delete the local `canvasToBlob` (and `loadHtmlImage`/`loadImage` where present) and add:

```ts
import { canvasToBlob, loadImage } from "@/lib/image/canvas";
```

Where the file hand-rolls the download anchor, replace with:

```ts
import { downloadBlob } from "@/lib/download";
// ...
downloadBlob(blob, filename);
```

The shared lib matches the universal local contract exactly (`(canvas, type?, quality?) => Promise<Blob | null>`), so `if (!blob)` guards at call sites stay untouched. Three components (SignatureMaker, FaviconGenerator, DepthMap) call their local helper with one arg relying on a PNG default — the lib's `type = "image/png"` default covers them. ScreenshotBeautifier omits quality — optional, covered. Do NOT change any error-handling branch.

- [ ] **Step 2 (after batch A, 5 components): Verify**

Run: `bun run test && bun run e2e:smoke`
Expected: unit suite green; smoke green for `/tools/image-converter`, `/tools/image-resizer`, `/tools/exif-remover`, `/tools/signature-maker`, `/tools/favicon-generator`.

- [ ] **Step 3: Commit batch A**

```bash
git add src/components/ImageConverter.tsx src/components/ImageResizer.tsx src/components/ExifRemover.tsx src/components/SignatureMaker.tsx src/components/FaviconGenerator.tsx
git commit -m "refactor(image): batch A onto shared canvas/download libs"
```

- [ ] **Step 4: Repeat Steps 1–3 for batch B, commit `refactor(image): batch B onto shared canvas/download libs`**

---

### Task 6: `src/lib/media/gif-encode.ts` + migrate the 3 gif.js call sites

**Files:**
- Create: `src/lib/media/gif-encode.ts`
- Test: `src/__tests__/lib/gif-encode.test.ts`
- Modify: `src/components/GifMaker.tsx`, `src/components/ScreenRecorder.tsx`, `src/components/VideoEditor.tsx`

**Interfaces:**
- Produces: `encodeGif(frames: GifFrame[], opts: GifOptions): Promise<Blob>` where
  `GifFrame = { source: CanvasImageSource; delayMs: number }` and
  `GifOptions = { width: number; height: number; quality?: number; repeat?: number; dither?: boolean; onProgress?: (p: number) => void }`.

- [ ] **Step 1: Failing test (gif.js mocked — it needs a real worker at runtime)**

`src/__tests__/lib/gif-encode.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";

const addFrame = vi.fn();
const on = vi.fn();
const render = vi.fn();
vi.mock("gif.js", () => ({
  default: vi.fn().mockImplementation(() => ({ addFrame, on, render })),
}));

import { encodeGif } from "@/lib/media/gif-encode";

describe("encodeGif", () => {
  it("adds every frame with its delay, renders, and resolves with the finished blob", async () => {
    const blob = new Blob(["gif"], { type: "image/gif" });
    on.mockImplementation((event: string, cb: (b: Blob) => void) => {
      if (event === "finished") setTimeout(() => cb(blob), 0);
    });
    const canvas = document.createElement("canvas");
    const result = await encodeGif(
      [
        { source: canvas, delayMs: 100 },
        { source: canvas, delayMs: 250 },
      ],
      { width: 320, height: 240 },
    );
    expect(addFrame).toHaveBeenCalledTimes(2);
    expect(addFrame).toHaveBeenNthCalledWith(2, canvas, expect.objectContaining({ delay: 250, copy: true }));
    expect(render).toHaveBeenCalledOnce();
    expect(result).toBe(blob);
  });
});
```

- [ ] **Step 2: Run — FAIL. Implement**

`src/lib/media/gif-encode.ts`:

```ts
/**
 * One gif.js pathway (worker at /gif.worker.js) for GifMaker,
 * ScreenRecorder and VideoEditor — previously three divergent copies.
 */
import GIF from "gif.js";

export interface GifFrame {
  source: CanvasImageSource;
  delayMs: number;
}

export interface GifOptions {
  width: number;
  height: number;
  /** gif.js quality: 1 (best) – 20 (fastest). Default 10. */
  quality?: number;
  /** 0 = loop forever (default), -1 = play once */
  repeat?: number;
  dither?: boolean;
  onProgress?: (progress: number) => void;
}

export function encodeGif(frames: GifFrame[], opts: GifOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      workerScript: "/gif.worker.js",
      width: opts.width,
      height: opts.height,
      quality: opts.quality ?? 10,
      repeat: opts.repeat ?? 0,
      dither: opts.dither ?? false,
    });
    for (const frame of frames) {
      gif.addFrame(frame.source, { delay: frame.delayMs, copy: true });
    }
    if (opts.onProgress) gif.on("progress", opts.onProgress);
    gif.on("finished", resolve);
    gif.on("abort", () => reject(new Error("GIF encode aborted")));
    gif.render();
  });
}
```

- [ ] **Step 3: Run test — PASS. Migrate the three components**

In `GifMaker.tsx`, `ScreenRecorder.tsx`, `VideoEditor.tsx`: replace the inline `new GIF({...})`/`addFrame`/`render` blocks with `encodeGif(frames, opts)` preserving each tool's existing option values exactly (GifMaker keeps quality slider + boomerang frame ordering — boomerang stays in the component, it's frame ordering, not encoding; ScreenRecorder keeps 8fps/480px; VideoEditor keeps its fps/width/dither controls).

- [ ] **Step 4: Verify**

Run: `bun run test && bun run e2e:smoke`
Expected: green, including `/tools/gif-maker`, `/tools/screen-recorder`, `/tools/video`. Manually exercise GIF export on /tools/gif-maker in the browser once (worker behavior is not covered by unit tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/media/gif-encode.ts src/__tests__/lib/gif-encode.test.ts src/components/GifMaker.tsx src/components/ScreenRecorder.tsx src/components/VideoEditor.tsx
git commit -m "refactor(media): single gif.js encode pathway"
```

---

### Task 7: `src/lib/media/ffmpeg.ts` singleton (modeled on hf-pipeline.ts)

**Files:**
- Create: `src/lib/media/ffmpeg.ts`
- Test: `src/__tests__/lib/ffmpeg.test.ts`
- Modify: `src/components/CompressVideo.tsx`

**Interfaces:**
- Produces: `getFFmpeg(onProgress?: (ratio: number) => void): Promise<FFmpeg>` — dynamic-imported, cached instance, core loaded from `/ffmpeg`.
- Wave 6 (audio cutter) and the Video Editor convert fix consume this.

- [ ] **Step 1: Failing test**

`src/__tests__/lib/ffmpeg.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";

const load = vi.fn().mockResolvedValue(undefined);
const onMock = vi.fn();
vi.mock("@ffmpeg/ffmpeg", () => ({
  FFmpeg: vi.fn().mockImplementation(() => ({ load, on: onMock, off: vi.fn(), loaded: false })),
}));
vi.mock("@ffmpeg/util", () => ({
  toBlobURL: vi.fn().mockResolvedValue("blob:mock-core"),
}));

import { getFFmpeg, __resetForTests } from "@/lib/media/ffmpeg";

describe("getFFmpeg", () => {
  it("loads once and returns the same instance on repeat calls", async () => {
    __resetForTests();
    const a = await getFFmpeg();
    const b = await getFFmpeg();
    expect(a).toBe(b);
    expect(load).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run — FAIL. Implement**

`src/lib/media/ffmpeg.ts`:

```ts
/**
 * Shared ffmpeg.wasm loader — dynamic import keeps the wasm core out of
 * the main bundle; single cached instance across tools.
 * Modeled on src/lib/hf-pipeline.ts.
 */
import type { FFmpeg } from "@ffmpeg/ffmpeg";

let instancePromise: Promise<FFmpeg> | null = null;

/**
 * Returns the cached FFmpeg instance, loading it on first call.
 * Load config verified against CompressVideo.tsx (2026-07-10):
 * core assets are served from /ffmpeg and MUST be wrapped in
 * toBlobURL() with explicit MIME types (@ffmpeg/ffmpeg 0.12.15).
 *
 * Progress listeners are the CALLER's responsibility:
 * `ffmpeg.on("progress", cb)` before exec, `ffmpeg.off("progress", cb)`
 * after — a listener param here would stack subscriptions across the
 * cached singleton.
 */
export function getFFmpeg(): Promise<FFmpeg> {
  if (!instancePromise) {
    instancePromise = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();
      const baseURL = "/ffmpeg";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return ffmpeg;
    })();
  }
  return instancePromise;
}

/** Test seam — clears the cached instance. */
export function __resetForTests(): void {
  instancePromise = null;
}
```

Migration detail for CompressVideo.tsx: it currently subscribes `ffmpeg.on("progress", onProgress)` per run — keep that pattern at the call site, and add the matching `ffmpeg.off("progress", onProgress)` in a `finally` so repeat compressions on the now-shared singleton don't stack listeners.

- [ ] **Step 3: Run test — PASS. Migrate CompressVideo.tsx to `getFFmpeg`, keeping its CRF/preset/scale command construction unchanged.**

- [ ] **Step 4: Verify — `bun run test && bun run e2e:smoke`, plus one manual compression of a small mp4 on /tools/compress-video.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/media/ffmpeg.ts src/__tests__/lib/ffmpeg.test.ts src/components/CompressVideo.tsx
git commit -m "refactor(media): shared ffmpeg singleton loader"
```

---

### Task 8: `src/lib/time-format.ts` + migrate Stopwatch and Pomodoro (Timer keeps its helper)

**Files:**
- Create: `src/lib/time-format.ts`
- Test: `src/__tests__/lib/time-format.test.ts`
- Modify: `src/components/Stopwatch.tsx`, `src/components/PomodoroTimer.tsx`, `src/components/Timer.tsx` (beep only)

**Interfaces:**
- Produces (contracts verified against current component output, 2026-07-10 — zero visual change):
  - `formatStopwatch(totalMs: number): string` → `"HH:MM:SS.CS"`, hours ALWAYS present (`"00:02:03.45"`) — matches Stopwatch.tsx exactly.
  - `formatMMSS(totalSeconds: number): string` → `"MM:SS"` that NEVER rolls to hours (`5400 → "90:00"`) — matches PomodoroTimer.tsx exactly.
  - `playBeep(frequency?: number, durationMs?: number): void` (Web Audio, no-ops without AudioContext).
- **Timer.tsx is deliberately excluded from format migration:** its local `formatTime(ms)` returns an object `{hh, mm, ss, ms}` consumed as separate animated digit fields — that's a UI-shaped helper, not shareable formatting. Timer migrates only its beep code to `playBeep`.

- [ ] **Step 1: Failing tests**

`src/__tests__/lib/time-format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { formatStopwatch, formatMMSS } from "@/lib/time-format";

describe("time formatting", () => {
  it("formatStopwatch always includes hours and centiseconds (matches current Stopwatch output)", () => {
    expect(formatStopwatch(0)).toBe("00:00:00.00");
    expect(formatStopwatch(123450)).toBe("00:02:03.45");
    expect(formatStopwatch(3723000)).toBe("01:02:03.00");
  });
  it("formatMMSS never rolls minutes into hours (matches current Pomodoro output)", () => {
    expect(formatMMSS(0)).toBe("00:00");
    expect(formatMMSS(1500)).toBe("25:00");
    expect(formatMMSS(5400)).toBe("90:00");
  });
});
```

- [ ] **Step 2: Run — FAIL. Implement**

`src/lib/time-format.ts`:

```ts
/**
 * Shared time formatting + completion beep. Output formats replicate the
 * existing components EXACTLY (R1 = zero visual change):
 * - formatStopwatch: Stopwatch.tsx contract, hours always shown.
 * - formatMMSS: PomodoroTimer.tsx contract, minutes never roll to hours.
 * Timer.tsx keeps its own {hh,mm,ss,ms} splitter (UI-shaped, per-digit render).
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function formatStopwatch(totalMs: number): string {
  const ms = Math.max(0, totalMs);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(centis)}`;
}

export function formatMMSS(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${pad(m)}:${pad(s)}`;
}

export function playBeep(frequency = 880, durationMs = 200): void {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
    osc.onended = () => ctx.close();
  } catch {
    /* audio is best-effort */
  }
}
```

- [ ] **Step 3: Run — PASS (2 test blocks). Migrate**

Each component keeps its own timing loop (they differ deliberately — rAF vs setInterval precision). Replace: Stopwatch's local `formatTime` → `formatStopwatch`; Pomodoro's local `formatTime` → `formatMMSS` (its separate `formatFocusTime` stats humanizer stays); all three components' inline Web Audio beep code → `playBeep`. Timer's `formatTime` object splitter stays untouched.

- [ ] **Step 4: Verify — `bun run test && bun run e2e:smoke` (routes /tools/timer, /tools/stopwatch, /tools/pomodoro). Existing timer unit tests must pass unmodified — if a formatting expectation differs, the lib is wrong, not the test.**

- [ ] **Step 5: Commit**

```bash
git add src/lib/time-format.ts src/__tests__/lib/time-format.test.ts src/components/Timer.tsx src/components/Stopwatch.tsx src/components/PomodoroTimer.tsx
git commit -m "refactor(time): shared stopwatch/pomodoro formatting + beep"
```

---

### Task 9: `FileDropzone` shared component + 3 pilot migrations

**Files:**
- Create: `src/components/shared/FileDropzone.tsx`
- Test: `src/__tests__/components/FileDropzone.test.tsx`
- Modify: `src/components/ImageCompression.tsx`, `src/components/ImageConverter.tsx`, `src/components/AudioTranscriber.tsx`

**Interfaces:**
- Produces:

```tsx
<FileDropzone
  onFiles={(files: File[]) => void}
  accept?: Record<string, string[]>   // react-dropzone accept map
  multiple?: boolean                   // default false
  maxSizeMB?: number
  title?: string                       // default "Drop a file, or click to choose"
  subtitle?: string                    // e.g. "PNG, JPEG, WebP · stays on your device"
/>
```

- Only 3 of the 24 dropzone components migrate in R1 (pilots proving the API). The remaining 21 migrate during R2's template rollout where their markup changes anyway.

- [ ] **Step 1: Failing test**

`src/__tests__/components/FileDropzone.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileDropzone } from "@/components/shared/FileDropzone";

describe("FileDropzone", () => {
  it("renders title and subtitle", () => {
    render(<FileDropzone onFiles={() => {}} title="Drop an image" subtitle="stays on your device" />);
    expect(screen.getByText("Drop an image")).toBeInTheDocument();
    expect(screen.getByText("stays on your device")).toBeInTheDocument();
  });

  it("calls onFiles with dropped files", async () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} />);
    const file = new File(["x"], "a.png", { type: "image/png" });
    const zone = screen.getByTestId("file-dropzone");
    fireEvent.drop(zone, { dataTransfer: { files: [file], items: [], types: ["Files"] } });
    await waitFor(() => expect(onFiles).toHaveBeenCalledWith([file]));
  });
});
```

- [ ] **Step 2: Run — FAIL. Implement (styling copies the dominant current dropzone look — border-dashed rounded-lg p-8 text-center cursor-pointer — so pilots don't change visually)**

`src/components/shared/FileDropzone.tsx`:

```tsx
"use client";

import { useDropzone, type Accept } from "react-dropzone";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  maxSizeMB,
  title = "Drop a file, or click to choose",
  subtitle,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFiles,
    accept,
    multiple,
    maxSize: maxSizeMB ? maxSizeMB * 1024 * 1024 : undefined,
  });

  return (
    <div
      {...getRootProps()}
      data-testid="file-dropzone"
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
    >
      <input {...getInputProps()} />
      <p className="font-medium">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Run — PASS (2). Migrate the 3 pilots, preserving each tool's `accept`/`multiple`/size caps exactly (ImageCompression: images single; ImageConverter: png/jpeg/webp/avif/heic single; AudioTranscriber: audio+video single).**

- [ ] **Step 4: Verify — `bun run test && bun run e2e:smoke`; existing tests for those tools unchanged and green.**

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/FileDropzone.tsx src/__tests__/components/FileDropzone.test.tsx src/components/ImageCompression.tsx src/components/ImageConverter.tsx src/components/AudioTranscriber.tsx
git commit -m "feat(shared): FileDropzone + pilot migrations"
```

---

### Task 10: Honesty fixes (audit spec §4.1)

**Files:**
- Modify: `src/components/AudioEditor.tsx`, `src/store/audio-store.ts`
- Modify: `src/lib/tools-config.ts` (descriptions for `/tools/pdf`, `/tools/zip`, `/tools/spreadsheet`, `/tools/file-converter`, `/tools/audio`, `/tools/video`; name for file-converter)
- Modify: `messages/en.json` (+ script-synced: ar, es, pt-BR, fr, de, ru, id, zh-CN)
- Create: `scripts/sync-honest-descriptions.mjs`
- Test: existing suites + `bun run validate`

**Interfaces:**
- Consumes: audit findings (no-op controls, overclaiming copy).
- Produces: UI that only shows working features; descriptions that match code.

- [ ] **Step 1: AudioEditor — remove the no-op controls**

In `src/components/AudioEditor.tsx`: delete the Fade In / Fade Out / Echo buttons and the waveform trim-selection UI (selection state is never applied to export). Keep upload, waveform display, play/pause, volume, playback speed, and download-original (relabel the button "Download original" — today's label implies processing). In `src/store/audio-store.ts`: delete the dead `effects` array and `addEffect` action; run `grep -rn "addEffect\|effects" src/` afterward — zero references must remain.

- [ ] **Step 2: New honest EN descriptions in `src/lib/tools-config.ts`**

(Locale key slugs verified in `messages/en.json` → `ToolsConfig.tools`: `pdf`, `zip`, `spreadsheet` (displayed "Spreadsheet Viewer"), `file-converter`, `audio`, `video`.)

```text
PDF Tools        → "Merge PDFs, split or extract pages, and turn images into a PDF — all in your browser with no file size limits."
Zip Tools        → "Create ZIP archives from your files and extract existing ones, right in your browser."
CSV/Excel Viewer → "View CSV and Excel files in your browser: sort, search, chart a column, and export the filtered view to CSV."
File Converter   → rename to "Data Format Converter"; description: "Convert data between CSV, TSV, JSON, XML, and YAML. Paste text, pick a target format, copy the result."
Audio Editor     → "Play audio files with adjustable volume and speed, view the waveform, and download your file."
Video Editor     → "Trim video clips and turn them into animated GIFs, right in your browser."
```

- [ ] **Step 3: Locale sync script**

`scripts/sync-honest-descriptions.mjs` — updates `ToolsConfig.tools.<slug>.{name,description}` in all 9 `messages/*.json` files. EN strings from Step 2; translations for the other 8 locales are embedded in the script (short factual sentences — translate the six EN strings above; AR must be reviewed by the user before merge, flag in PR description). Structure:

```js
import { readFileSync, writeFileSync } from "node:fs";

const BY_LOCALE = {
  en: { pdf: { description: "Merge PDFs, split or extract pages, ..." }, /* …six slugs… */ },
  ar: { /* المحتوى العربي للأدوات الست */ },
  /* es, "pt-BR", fr, de, ru, id, "zh-CN" — same six slugs each */
};

for (const [locale, entries] of Object.entries(BY_LOCALE)) {
  const path = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(path, "utf8"));
  for (const [slug, patch] of Object.entries(entries)) {
    Object.assign(json.ToolsConfig.tools[slug], patch);
  }
  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
}
console.log("synced", Object.keys(BY_LOCALE).length, "locales");
```

(The implementer fills all six slugs × 9 locales in the script — the file-converter entry also patches `name`. 2-space indent + trailing newline matches repo formatting.)

- [ ] **Step 4: Verify**

Run: `node scripts/sync-honest-descriptions.mjs && bun run validate && npx tsc --noEmit && bun run test && bun run e2e:smoke`
Expected: all green (typecheck catches any missed locale key).

- [ ] **Step 5: Commit**

```bash
git add src/components/AudioEditor.tsx src/store/audio-store.ts src/lib/tools-config.ts messages/ scripts/sync-honest-descriptions.mjs
git commit -m "fix(catalog): remove no-op audio controls; make tool descriptions match implemented features"
```

---

### Task 11: E2E smoke in CI

**Files:**
- Modify: `.github/workflows/validate-tools.yml`

- [ ] **Step 1: Add the smoke job after the existing `ci` job**

```yaml
  e2e-smoke:
    runs-on: ubuntu-latest
    needs: ci
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - run: bunx playwright install --with-deps chromium
      - run: bun run build
      - run: bun run e2e:smoke
```

- [ ] **Step 2: Verify locally that the exact commands pass: `bun run build && bun run e2e:smoke`**

- [ ] **Step 3: Commit; after push, confirm the job is green on the PR before merging anything else onto the branch.**

```bash
git add .github/workflows/validate-tools.yml
git commit -m "ci: run all-tools e2e smoke on every PR"
```

---

## Task → model assignment (execution policy)

| Task | Executor model | Rationale |
| --- | --- | --- |
| 0 gitignore/docs | done (main session) | |
| 1 e2e smoke suite | Sonnet | fully specified, mechanical |
| 2 lib/download | Sonnet | complete code in plan |
| 3 clipboard + CopyButton | Sonnet | complete code in plan |
| 4 lib/image/canvas | Sonnet | complete code in plan |
| 5 canvas migrations ×10 | **Opus** | surgery in 300–1100-line components |
| 6 gif-encode + 3 migrations | **Opus** | VideoEditor/ScreenRecorder complexity |
| 7 ffmpeg singleton | **Opus** | must preserve working toBlobURL config + listener hygiene |
| 8 time-format + 2 migrations | Sonnet | contracts fully verified & specified |
| 9 FileDropzone + pilots | Sonnet (component) / **Opus** (pilot migrations) | |
| 10 honesty fixes + locales | **Opus** | component surgery + 9-locale copy; Arabic reviewed by user pre-merge |
| 11 CI smoke job | Sonnet | |
| Review gate between every task | **Fable (main session)** | diff review + re-run verify commands; never delegated |

## Definition of done (Wave R1)

- [ ] `bun run test` green (existing 358 + ~15 new)
- [ ] `bun run e2e:smoke` green across all 137 routes (or route in documented skip-list)
- [ ] CI includes the smoke job and passes
- [ ] Zero remaining private copies: `grep -rln "canvasToBlob" src/components | wc -l` → 0; gif.js constructed only in `lib/media/gif-encode.ts`; beep/format helpers only in `lib/time-format.ts` (Timer's `{hh,mm,ss,ms}` splitter exempt, documented)
- [ ] Audit §3.1/§3.2 honesty items all closed (no no-op UI, no overclaiming description)
- [ ] No visual regressions (R1 changes zero styling)
- [ ] R1 merges to main as its own PR before R2 begins (it's invisible to users and de-risks the branch)
