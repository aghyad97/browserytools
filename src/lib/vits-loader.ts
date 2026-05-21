/**
 * Loader for the in-browser Piper/VITS text-to-speech engine
 * (@diffusionstudio/vits-web). It is loaded from a CDN at runtime rather than
 * bundled: the library ships Node-only `require("fs")` code in a dead browser
 * branch that breaks the bundler (Turbopack in particular). The voice model
 * (~20-60MB) is fetched from a CDN on first use, then cached on-device.
 *
 * Typed as `string` so the bundler/TS treat it as a runtime URL, not a module
 * specifier to resolve at build time.
 */
const VITS_CDN: string = "https://esm.sh/@diffusionstudio/vits-web@1.0.3";

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
    modulePromise = import(
      /* webpackIgnore: true */ /* @vite-ignore */ VITS_CDN
    ) as Promise<VitsModule>;
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
