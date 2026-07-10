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
