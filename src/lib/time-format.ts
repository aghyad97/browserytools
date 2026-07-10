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
