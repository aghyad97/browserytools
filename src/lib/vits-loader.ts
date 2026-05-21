/**
 * Loader for the in-browser Piper/VITS text-to-speech engine
 * (@diffusionstudio/vits-web). Bundled (lazy dynamic import) rather than loaded
 * from a CDN: a CDN build (esm.sh) shims `process`, which makes the engine's
 * emscripten module take its Node code path and call `fs.readFile` (fails in
 * the browser). The bundled webpack build keeps emscripten on the browser path
 * (fetch). The voice model (~20-60MB) is fetched from a CDN on first use, then
 * cached on-device.
 *
 * NOTE: this static specifier currently breaks `next dev --turbopack` (the
 * library ships a Node-only `require("fs")` branch Turbopack can't resolve);
 * the webpack production build resolves it via the `fs: false` fallback and
 * runs correctly. Verify with the production server / `next dev --webpack`.
 */
export type VitsProgress = { url: string; total: number; loaded: number };

type VitsModule = {
  predict: (
    config: { text: string; voiceId: string },
    callback?: (progress: VitsProgress) => void
  ) => Promise<Blob>;
};

let modulePromise: Promise<VitsModule> | null = null;

function loadVits(): Promise<VitsModule> {
  if (!modulePromise) {
    modulePromise = import("@diffusionstudio/vits-web") as Promise<VitsModule>;
  }
  return modulePromise;
}

/** Synthesize `text` with the given Piper voice id, returning a WAV Blob. */
export async function synthesizeSpeech(
  text: string,
  voiceId: string,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const tts = await loadVits();
  return tts.predict({ text, voiceId }, (p) => {
    if (onProgress && p.total > 0) {
      onProgress(Math.min(100, Math.round((p.loaded / p.total) * 100)));
    }
  });
}
