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
  download: (
    voiceId: string,
    callback?: (progress: VitsProgress) => void
  ) => Promise<void>;
  stored: () => Promise<string[]>;
};

let modulePromise: Promise<VitsModule> | null = null;

function loadVits(): Promise<VitsModule> {
  if (!modulePromise) {
    modulePromise = import("@diffusionstudio/vits-web") as Promise<VitsModule>;
  }
  return modulePromise;
}

/** True if the voice's model is already cached on-device (no download needed). */
export async function isVoiceReady(voiceId: string): Promise<boolean> {
  const tts = await loadVits();
  const stored = await tts.stored();
  return stored.includes(voiceId);
}

/**
 * Pre-download and cache a voice's model so later playback/export is instant.
 * No-ops if the model is already cached. Reports 0-100% download progress.
 */
export async function prepareVoice(
  voiceId: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  const tts = await loadVits();
  const stored = await tts.stored();
  if (stored.includes(voiceId)) {
    onProgress?.(100);
    return;
  }
  await tts.download(voiceId, (p) => {
    if (onProgress && p.total > 0) {
      onProgress(Math.min(100, Math.round((p.loaded / p.total) * 100)));
    }
  });
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
