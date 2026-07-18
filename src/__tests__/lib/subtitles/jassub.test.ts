import { describe, it, expect, vi, beforeEach } from "vitest";

// JASSUB must NEVER load real wasm in tests. Mock the module with a fake
// class that mirrors the real constructor's async shape: `ready` resolves
// once `renderer` (the worker's ASSRenderer proxy) is populated, and
// `renderer.setTrack` is the method that re-feeds ASS content.
let lastInstance: FakeJassub | null = null;
const constructorArgs: unknown[] = [];

class FakeJassub {
  opts: Record<string, unknown>;
  setTrack = vi.fn();
  destroy = vi.fn().mockResolvedValue(undefined);
  renderer: { setTrack: (content: string) => void };
  ready: Promise<void>;

  constructor(opts: Record<string, unknown>) {
    this.opts = opts;
    constructorArgs.push(opts);
    this.renderer = { setTrack: this.setTrack };
    this.ready = Promise.resolve();
    // Capturing the constructed instance for assertions is the point of this fake.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastInstance = this;
  }
}

vi.mock("jassub", () => ({
  default: FakeJassub,
}));

// Import after the mock so the module under test picks up the fake class.
const { mountPreview } = await import("@/lib/subtitles/jassub");

beforeEach(() => {
  constructorArgs.length = 0;
  lastInstance = null;
});

function fakeVideo(): HTMLVideoElement {
  return document.createElement("video");
}
function fakeCanvas(): HTMLCanvasElement {
  return document.createElement("canvas");
}

describe("jassub mountPreview", () => {
  it("constructs JASSUB with self-hosted asset paths under /jassub/, not a CDN", () => {
    mountPreview(fakeVideo(), fakeCanvas(), "dummy ass");

    expect(constructorArgs).toHaveLength(1);
    const opts = constructorArgs[0] as Record<string, unknown>;

    expect(opts.workerUrl).toBe("/jassub/jassub-worker.bundle.js");
    expect(opts.wasmUrl).toBe("/jassub/jassub-worker.wasm");
    expect(opts.modernWasmUrl).toBe("/jassub/jassub-worker-modern.wasm");
    expect(opts.subContent).toBe("dummy ass");

    const fonts = opts.availableFonts as Record<string, string>;
    expect(fonts["liberation sans"]).toBe("/jassub/default.woff2");

    // No asset path may point off-origin.
    for (const value of [opts.workerUrl, opts.wasmUrl, opts.modernWasmUrl, fonts["liberation sans"]]) {
      expect(value).toMatch(/^\/jassub\//);
      expect(value).not.toMatch(/^https?:\/\//);
    }
  });

  it("setAss re-feeds new ASS via the renderer's setTrack once ready", async () => {
    const handle = mountPreview(fakeVideo(), fakeCanvas(), "initial ass");
    const instance = lastInstance;
    expect(instance).not.toBeNull();

    handle.setAss("updated ass");
    // setAss awaits instance.ready internally before calling setTrack.
    await instance!.ready;
    await Promise.resolve();

    expect(instance!.setTrack).toHaveBeenCalledWith("updated ass");
  });

  it("destroy tears down the JASSUB instance", () => {
    const handle = mountPreview(fakeVideo(), fakeCanvas(), "ass");
    const instance = lastInstance;

    handle.destroy();

    expect(instance!.destroy).toHaveBeenCalledTimes(1);
  });
});
