import { describe, it, expect, vi, afterEach } from "vitest";
import { formatStopwatch, formatMMSS, playBeep } from "@/lib/time-format";

describe("time formatting", () => {
  it("formatStopwatch always includes hours and centiseconds (matches current Stopwatch output)", () => {
    expect(formatStopwatch(0)).toBe("00:00:00.00");
    expect(formatStopwatch(123450)).toBe("00:02:03.45");
    expect(formatStopwatch(3723000)).toBe("01:02:03.00");
  });
  it("formatMMSS never rolls minutes into hours (matches current Pomodoro output)", () => {
    expect(formatMMSS(0)).toBe("00:00");
    expect(formatMMSS(1500)).toBe("25:00");
    expect(formatMMSS(5400)).toBe("90:00");
  });
});

type CtxState = "running" | "suspended";

function makeAudioCtxMock(initialState: CtxState) {
  const osc = {
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null as (() => void) | null,
  };
  const gainNode = {
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  };
  const ctx = {
    state: initialState as CtxState,
    currentTime: 0,
    destination: {},
    resume: vi.fn(() => {
      ctx.state = "running";
      return Promise.resolve();
    }),
    close: vi.fn(() => Promise.resolve()),
    createOscillator: vi.fn(() => osc),
    createGain: vi.fn(() => gainNode),
  };
  return { ctx, osc, gainNode };
}

function stubAudioContext(ctx: unknown) {
  Object.defineProperty(window, "AudioContext", {
    // must be `function` (not arrow) so `new Ctx()` works
    value: vi.fn(function AudioContextMock() {
      return ctx;
    }),
    configurable: true,
    writable: true,
  });
}

describe("playBeep", () => {
  afterEach(() => {
    delete (window as { AudioContext?: unknown }).AudioContext;
  });

  it("plays immediately when the context is running", () => {
    const { ctx, osc, gainNode } = makeAudioCtxMock("running");
    stubAudioContext(ctx);

    playBeep(880, 800);

    expect(ctx.resume).not.toHaveBeenCalled();
    expect(osc.frequency.value).toBe(880);
    expect(osc.start).toHaveBeenCalled();
    expect(osc.stop).toHaveBeenCalledWith(0.8);
    // Envelope matches Pomodoro's original end chime: 0.3 → exp decay to 0.001
    expect(gainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.3, 0);
    expect(gainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.001, 0.8);
  });

  it("resumes a suspended context before scheduling the oscillator (autoplay unlock)", async () => {
    const { ctx, osc } = makeAudioCtxMock("suspended");
    stubAudioContext(ctx);

    playBeep(440, 150);

    expect(ctx.resume).toHaveBeenCalledTimes(1);
    expect(osc.start).not.toHaveBeenCalled(); // not before resume resolves
    await Promise.resolve(); // flush the resume().then(...) chain
    expect(osc.start).toHaveBeenCalled();
    expect(osc.frequency.value).toBe(440);
    expect(osc.stop).toHaveBeenCalledWith(0.15);
  });

  it("closes the context and stays silent when resume is rejected", async () => {
    const { ctx, osc } = makeAudioCtxMock("suspended");
    ctx.resume.mockImplementation(() => Promise.reject(new Error("blocked")));
    stubAudioContext(ctx);

    playBeep();

    await Promise.resolve();
    await Promise.resolve(); // flush .then + .catch
    expect(osc.start).not.toHaveBeenCalled();
    expect(ctx.close).toHaveBeenCalled();
  });

  it("no-ops without AudioContext", () => {
    delete (window as { AudioContext?: unknown }).AudioContext;
    expect(() => playBeep()).not.toThrow();
  });
});
