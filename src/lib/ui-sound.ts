/**
 * Synthesized interaction-sound system (R2 chrome).
 *
 * Inspired by cuelume: every cue is synthesized live with the Web Audio API —
 * zero audio files, zero dependencies. Cues are deliberately QUIET, ambient
 * feedback (peak gain ≤ 0.08, 30–120ms, gentle exponential decay), NOT alerts.
 *
 * One AudioContext is created lazily and shared across every cue. Like
 * `playBeep` in @/lib/time-format (the repo's reviewed precedent), a suspended
 * context is resumed before scheduling so the first cue after the opt-in
 * gesture unlocks under browser autoplay policies. Unlike playBeep, the shared
 * context is kept open and reused (cues fire far more often than a timer chime).
 *
 * `playCue(name)` never throws and no-ops when:
 *   - the user hasn't opted in (useSoundStore.soundOn === false),
 *   - no AudioContext implementation is available (SSR / old browsers),
 *   - the user prefers reduced motion (they opted out of decoration).
 *
 * The mute state is read OUTSIDE React via useSoundStore.getState() so the many
 * chrome call sites (rail clicks, palette nav, copy, primary actions) stay
 * subscription-free.
 */

import { useSoundStore } from "@/store/sound-store";

export type CueName =
  | "tick"
  | "press"
  | "toggle"
  | "success"
  | "open"
  | "close";

/** One scheduled oscillator with a percussive attack → exp-decay envelope. */
interface Tone {
  /** Start frequency (Hz). */
  freq: number;
  /** Optional exponential glide target (Hz) — used by open/close. */
  endFreq?: number;
  type: OscillatorType;
  /** Seconds after the cue's start before this tone begins. */
  delay: number;
  /** Tone length in seconds (0.03–0.12). */
  duration: number;
  /** Envelope peak gain (≤ 0.08 — these are ambient, not alerts). */
  peak: number;
}

/* Cue vocabulary (spec §1). Frequencies/durations documented in the report. */
const CUES: Record<CueName, Tone[]> = {
  // Tiny high blip for selection/navigation changes.
  tick: [{ freq: 2000, type: "sine", delay: 0, duration: 0.03, peak: 0.03 }],
  // Soft low tap for button presses.
  press: [{ freq: 180, type: "triangle", delay: 0, duration: 0.05, peak: 0.06 }],
  // Two quick ascending blips for state flips.
  toggle: [
    { freq: 520, type: "sine", delay: 0, duration: 0.045, peak: 0.045 },
    { freq: 780, type: "sine", delay: 0.06, duration: 0.05, peak: 0.045 },
  ],
  // Gentle major-third pair for copy/download completions.
  success: [
    { freq: 660, type: "sine", delay: 0, duration: 0.12, peak: 0.05 },
    { freq: 830, type: "sine", delay: 0.05, duration: 0.12, peak: 0.05 },
  ],
  // Short up-glide for palette open.
  open: [{ freq: 300, endFreq: 620, type: "sine", delay: 0, duration: 0.08, peak: 0.04 }],
  // Short down-glide for palette close.
  close: [{ freq: 620, endFreq: 300, type: "sine", delay: 0, duration: 0.08, peak: 0.04 }],
};

let sharedCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx) {
    try {
      sharedCtx = new Ctx();
    } catch {
      return null;
    }
  }
  return sharedCtx;
}

function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches === true
    );
  } catch {
    return false;
  }
}

function schedule(ctx: AudioContext, tones: Tone[]): void {
  const now = ctx.currentTime;
  for (const tone of tones) {
    const startAt = now + tone.delay;
    const endAt = startAt + tone.duration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tone.type;
    osc.frequency.setValueAtTime(tone.freq, startAt);
    if (tone.endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(tone.endFreq, endAt);
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    // Percussive envelope: full peak at attack, exponential decay to silence.
    gain.gain.setValueAtTime(tone.peak, startAt);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
    osc.start(startAt);
    osc.stop(endAt);
  }
}

/**
 * Play a UI cue. Best-effort and silent by contract: never throws, no-ops when
 * muted, unavailable, or when the user prefers reduced motion.
 */
export function playCue(name: CueName): void {
  try {
    if (!useSoundStore.getState().soundOn) return;
    if (prefersReducedMotion()) return;
    const tones = CUES[name];
    if (!tones) return;
    const ctx = getContext();
    if (!ctx) return;
    const run = () => schedule(ctx, tones);
    // Mirror playBeep's resume-chaining unlock semantics for the shared context.
    if (ctx.state === "suspended") {
      ctx.resume().then(run).catch(() => {});
    } else {
      run();
    }
  } catch {
    /* audio is best-effort — a cue must never break an interaction */
  }
}
