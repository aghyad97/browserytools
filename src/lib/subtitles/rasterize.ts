// Headless JASSUB rasterizer — burns the ASS caption track to a sequence of
// transparent PNG frames without ever needing a live <video> element.
//
// This is deliberately separate from ./jassub.ts's mountPreview(): that
// handle is bound to a live video/canvas pair for on-page playback and
// doesn't expose the renderer for frame-accurate offline capture. The burn
// pipeline needs its own instance driven by manualRender() at explicit
// media times.
//
// Approach copied VERBATIM from the Task-1 spike (gotcha #1,
// docs/superpowers/specs/2026-07-18-wave-5-spike-findings.md): JASSUB calls
// `canvas.transferControlToOffscreen()` and hands the canvas to its worker,
// so the main thread can never `getImageData()` on it directly. The proven
// handoff is `await instance.manualRender({ mediaTime, width, height,
// expectedDisplayTime })` (its promise resolves *after* the worker's
// `_draw`), then `readCtx.drawImage(jassubCanvas, 0, 0)` onto a SEPARATE 2-D
// canvas and `toBlob('image/png')`. The FIRST manualRender only triggers a
// resize (no draw), so a warm-up call is required before the capture loop.
import JASSUB from "jassub";

const JASSUB_BASE = "/jassub";

// Yields until the next compositor frame. JASSUB's worker draws into the
// OffscreenCanvas it took from `jassubCanvas` via WebGL, and that draw is
// COMMITTED to the on-page placeholder canvas asynchronously — after the
// worker's task (and thus after `manualRender`'s promise, which only awaits
// the Comlink round-trip of `_draw`, has already resolved). Reading the
// placeholder with `drawImage` in the same microtask therefore samples a
// stale/blank frame, which is why the burned MP4 came out caption-less.
// Awaiting a rAF hands the browser a compositor tick to propagate the
// worker's commit to the placeholder before we read it. A timeout fallback
// keeps the loop alive if rAF is starved (e.g. a backgrounded tab).
function nextPaint(): Promise<void> {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    requestAnimationFrame(() => finish());
    setTimeout(finish, 100);
  });
}

export interface RasterizeOptions {
  ass: string;
  dims: { w: number; h: number };
  duration: number;
  /** Caption-layer render rate in frames per second (independent of the source video's fps). */
  fps: number;
}

/**
 * Renders `ass` over `duration` seconds at `fps`, returning one transparent
 * PNG (as raw bytes) per tick, in order, ready to write to ffmpeg's MEMFS
 * as `cap0000.png`, `cap0001.png`, ...
 */
export async function rasterizeCaptionFrames(
  opts: RasterizeOptions
): Promise<Uint8Array[]> {
  const { ass, dims, duration, fps } = opts;

  // JASSUB owns this canvas (transfers it to its worker) — it is never read
  // from directly. A separate canvas does the readback. It stays DETACHED:
  // attaching it wakes JASSUB's ResizeObserver, which drives a runaway
  // resize feedback loop off the element's layout box.
  const jassubCanvas = document.createElement("canvas");

  const readCanvas = document.createElement("canvas");
  readCanvas.width = dims.w;
  readCanvas.height = dims.h;
  const readCtx = readCanvas.getContext("2d", { willReadFrequently: true });
  if (!readCtx) {
    throw new Error("2D canvas context unavailable for caption rasterization");
  }

  const instance = new JASSUB({
    canvas: jassubCanvas,
    workerUrl: `${JASSUB_BASE}/jassub-worker.bundle.js`,
    wasmUrl: `${JASSUB_BASE}/jassub-worker.wasm`,
    modernWasmUrl: `${JASSUB_BASE}/jassub-worker-modern.wasm`,
    subContent: ass,
    availableFonts: {
      "liberation sans": `${JASSUB_BASE}/default.woff2`,
    },
  });

  try {
    await instance.ready;

    // Gotcha #1: the FIRST manualRender only triggers a resize, no draw —
    // burn a throwaway call before the capture loop so frame 0 isn't blank.
    // It also latches JASSUB's internal _videoWidth/_videoHeight to our dims
    // so later renders take the draw path (not the resize path) again.
    await instance.manualRender({
      mediaTime: 0,
      width: dims.w,
      height: dims.h,
      expectedDisplayTime: 0,
    });

    // Force the render surface to exactly dims.w × dims.h. Without a live
    // <video>, JASSUB's implicit resize derives the render size from the
    // canvas element's layout box (clientWidth/clientHeight) — which is 0 for
    // our detached canvas, so libass would render into a 1×1 buffer and every
    // caption falls outside the readback region (the burned MP4 comes out
    // blank). Passing renderWidth/renderHeight explicitly bypasses that
    // element-based computation and repaints at the correct size.
    await instance.resize(false, dims.w, dims.h);
    await nextPaint();

    const frameCount = Math.max(1, Math.ceil(duration * fps));
    const frames: Uint8Array[] = [];

    for (let i = 0; i < frameCount; i++) {
      const mediaTime = i / fps;
      await instance.manualRender({
        mediaTime,
        width: dims.w,
        height: dims.h,
        expectedDisplayTime: mediaTime * 1000,
      });
      // Yield a compositor tick so the worker's OffscreenCanvas commit is
      // guaranteed to have propagated to the placeholder before we read it —
      // see nextPaint's note.
      await nextPaint();

      readCtx.clearRect(0, 0, dims.w, dims.h);
      readCtx.drawImage(jassubCanvas, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        readCanvas.toBlob(resolve, "image/png");
      });
      if (!blob) {
        throw new Error(`Caption frame ${i} failed to encode as PNG`);
      }
      frames.push(new Uint8Array(await blob.arrayBuffer()));
    }

    return frames;
  } finally {
    void instance.destroy();
  }
}
