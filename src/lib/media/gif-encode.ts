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
  /** gif.js dither: false (default), true, or an algorithm name like "FloydSteinberg". */
  dither?: boolean | string;
  onProgress?: (progress: number) => void;
  /** Abort the encode mid-render; rejects with `Error("GIF encode aborted")`. */
  signal?: AbortSignal;
}

export function encodeGif(frames: GifFrame[], opts: GifOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (opts.signal?.aborted) {
      reject(new Error("GIF encode aborted"));
      return;
    }
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
    const onAbort = () => gif.abort();
    opts.signal?.addEventListener("abort", onAbort);
    const settle = () => opts.signal?.removeEventListener("abort", onAbort);
    if (opts.onProgress) gif.on("progress", opts.onProgress);
    gif.on("finished", (blob: Blob) => {
      settle();
      resolve(blob);
    });
    gif.on("abort", () => {
      settle();
      reject(new Error("GIF encode aborted"));
    });
    gif.render();
  });
}
