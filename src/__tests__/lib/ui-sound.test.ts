import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Control the mute flag that playCue reads out-of-React via getState().
const { soundState } = vi.hoisted(() => ({ soundState: { soundOn: false } }));
vi.mock("@/store/sound-store", () => ({
  useSoundStore: { getState: () => soundState },
}));

function makeCtxMock(state: "running" | "suspended" = "running") {
  const osc = {
    type: "" as OscillatorType | "",
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const gain = {
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  };
  const ctx = {
    state,
    currentTime: 0,
    destination: {},
    resume: vi.fn(() => {
      ctx.state = "running";
      return Promise.resolve();
    }),
    createOscillator: vi.fn(() => osc),
    createGain: vi.fn(() => gain),
  };
  return { ctx, osc, gain };
}

function stubAudioContext(mock: ReturnType<typeof makeCtxMock>) {
  const ctor = vi.fn(function AudioContextMock() {
    return mock.ctx;
  });
  Object.defineProperty(window, "AudioContext", {
    value: ctor,
    configurable: true,
    writable: true,
  });
  return ctor;
}

describe("ui-sound playCue", () => {
  beforeEach(() => {
    // Reset the module so the lazily-created shared AudioContext is fresh.
    vi.resetModules();
    soundState.soundOn = false;
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    delete (window as { AudioContext?: unknown }).AudioContext;
  });

  it("stays silent and constructs no AudioContext when muted", async () => {
    soundState.soundOn = false;
    const mock = makeCtxMock("running");
    const ctor = stubAudioContext(mock);
    const { playCue } = await import("@/lib/ui-sound");

    playCue("tick");

    expect(ctor).not.toHaveBeenCalled();
    expect(mock.osc.start).not.toHaveBeenCalled();
  });

  it("schedules an oscillator with an envelope when unmuted", async () => {
    soundState.soundOn = true;
    const mock = makeCtxMock("running");
    const ctor = stubAudioContext(mock);
    const { playCue } = await import("@/lib/ui-sound");

    playCue("tick");

    expect(ctor).toHaveBeenCalledTimes(1);
    expect(mock.osc.frequency.setValueAtTime).toHaveBeenCalled();
    expect(mock.gain.gain.exponentialRampToValueAtTime).toHaveBeenCalled();
    expect(mock.osc.start).toHaveBeenCalled();
    expect(mock.osc.stop).toHaveBeenCalled();
  });

  it("no-ops when the user prefers reduced motion", async () => {
    soundState.soundOn = true;
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
    const mock = makeCtxMock("running");
    const ctor = stubAudioContext(mock);
    const { playCue } = await import("@/lib/ui-sound");

    playCue("tick");

    expect(ctor).not.toHaveBeenCalled();
    expect(mock.osc.start).not.toHaveBeenCalled();
  });

  it("resumes a suspended context before scheduling (autoplay unlock)", async () => {
    soundState.soundOn = true;
    const mock = makeCtxMock("suspended");
    stubAudioContext(mock);
    const { playCue } = await import("@/lib/ui-sound");

    playCue("success");

    expect(mock.ctx.resume).toHaveBeenCalledTimes(1);
    expect(mock.osc.start).not.toHaveBeenCalled(); // waits for resume to resolve
    await Promise.resolve(); // flush the resume().then(...) chain
    expect(mock.osc.start).toHaveBeenCalled();
  });

  it("never throws without an AudioContext implementation", async () => {
    soundState.soundOn = true;
    delete (window as { AudioContext?: unknown }).AudioContext;
    const { playCue } = await import("@/lib/ui-sound");

    expect(() => playCue("press")).not.toThrow();
  });
});
