// JASSUB (in-browser libass) preview mount — renders the same ASS the burn
// pipeline consumes, over a live <video>, so preview == export by
// construction (see docs/superpowers/plans/2026-07-18-wave-5-subtitle-studio.md).
//
// Asset paths + constructor shape are copied VERBATIM from the Task-1 spike
// (docs/superpowers/specs/2026-07-18-wave-5-spike-findings.md, gotcha #2/#3):
// the worker must be the Bun-bundled self-contained ESM file (JASSUB's stock
// worker has bare imports that don't load as a static module worker), and
// the wasm + font are self-hosted under /jassub/ — NEVER a CDN.
import JASSUB from "jassub";

const JASSUB_BASE = "/jassub";

export interface JassubHandle {
  /** Re-feeds a new ASS script to the renderer (replaces the current track). */
  setAss(ass: string): void;
  /** Tears down the JASSUB instance (worker + canvas listeners). */
  destroy(): void;
}

/**
 * Mounts a JASSUB instance over `video`, rasterizing `ass` onto `canvas`
 * synced to playback. Points JASSUB at the self-hosted worker/wasm/font
 * under /jassub/ (produced by scripts/copy-jassub.mjs) — zero CDN fetches.
 */
export function mountPreview(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  ass: string
): JassubHandle {
  const instance = new JASSUB({
    video,
    canvas,
    workerUrl: `${JASSUB_BASE}/jassub-worker.bundle.js`,
    wasmUrl: `${JASSUB_BASE}/jassub-worker.wasm`,
    modernWasmUrl: `${JASSUB_BASE}/jassub-worker-modern.wasm`,
    subContent: ass,
    availableFonts: {
      "liberation sans": `${JASSUB_BASE}/default.woff2`,
    },
  });

  function setAss(next: string): void {
    // `renderer` is only populated once the worker's async init resolves
    // (instance.ready) — see node_modules/jassub/dist/jassub.js. setTrack
    // is the ASSRenderer method that replaces the current track content.
    void instance.ready.then(() => {
      instance.renderer?.setTrack(next);
    });
  }

  function destroy(): void {
    void instance.destroy();
  }

  return { setAss, destroy };
}
