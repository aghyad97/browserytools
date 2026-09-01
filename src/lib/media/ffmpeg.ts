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
      try {
        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        const { toBlobURL } = await import("@ffmpeg/util");
        const ffmpeg = new FFmpeg();
        const baseURL = "/ffmpeg";
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });
        return ffmpeg;
      } catch (err) {
        // Clear the cache so a failed load can be retried on the next call.
        instancePromise = null;
        throw err;
      }
    })();
  }
  return instancePromise;
}

/**
 * Cancel support: kills the worker behind the cached instance (which rejects
 * every in-flight exec/load with "called FFmpeg.terminate()") and drops the
 * cache so the next getFFmpeg() boots a fresh engine. Safe to call while a
 * load is still in flight — the doomed instance is terminated once it lands.
 * No-op when nothing has been loaded.
 */
export function terminateFFmpeg(): void {
  const doomed = instancePromise;
  instancePromise = null;
  if (!doomed) return;
  doomed.then((ffmpeg) => ffmpeg.terminate()).catch(() => {
    // The load itself failed (or was torn down) — nothing left to terminate.
  });
}

/** Test seam — clears the cached instance. */
export function __resetForTests(): void {
  instancePromise = null;
}
