import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScreenRecorder from "@/components/ScreenRecorder";

// ── gif.js mock ───────────────────────────────────────────────────────────────
// The GIF encoder uses a self-hosted worker (public/vendor/gif.worker.js) which
// is not available in happy-dom. Mock it so the export path is exercised without
// a real worker. Captures the workerScript option for assertion.
const gifInstances: Array<Record<string, unknown>> = [];
const lastGifOptions: { value: { workerScript?: string; [k: string]: unknown } | undefined } = { value: undefined };

vi.mock("gif.js", () => {
  class MockGIF {
    handlers: Record<string, ((...a: unknown[]) => void)[]> = {};
    constructor(options?: { workerScript?: string; [k: string]: unknown }) {
      lastGifOptions.value = options;
      gifInstances.push(this as unknown as Record<string, unknown>);
    }
    on(event: string, cb: (...a: unknown[]) => void) {
      (this.handlers[event] ||= []).push(cb);
      return this;
    }
    addFrame = vi.fn();
    render() {
      this.handlers["progress"]?.forEach((cb) => cb(1));
      const blob = new Blob(["gif"], { type: "image/gif" });
      this.handlers["finished"]?.forEach((cb) => cb(blob, new Uint8Array()));
    }
  }
  return { default: MockGIF };
});

// ── MediaRecorder mock (test-setup has none) ───────────────────────────────────
class MockMediaRecorder {
  static isTypeSupported = vi.fn().mockReturnValue(true);
  state: "inactive" | "recording" = "inactive";
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  stream: MediaStream;
  constructor(stream: MediaStream) {
    this.stream = stream;
  }
  start() {
    this.state = "recording";
    // emit a chunk asynchronously
    setTimeout(() => {
      this.ondataavailable?.({ data: new Blob(["x"], { type: "video/webm" }) });
    }, 0);
  }
  stop() {
    this.state = "inactive";
    this.onstop?.();
  }
}

// ── MediaStream / track mocks ──────────────────────────────────────────────────
function makeVideoTrack() {
  return {
    kind: "video",
    stop: vi.fn(),
    onended: null,
    getSettings: () => ({ width: 1280, height: 720 }),
  };
}
function makeAudioTrack() {
  return { kind: "audio", stop: vi.fn() };
}

class MockMediaStream {
  _tracks: Array<{ kind: string; stop: () => void }>;
  constructor(tracks: Array<{ kind: string; stop: () => void }> = []) {
    this._tracks = tracks.length ? tracks : [makeVideoTrack()];
  }
  getTracks() {
    return this._tracks;
  }
  getVideoTracks() {
    return this._tracks.filter((t) => t.kind === "video");
  }
  getAudioTracks() {
    return this._tracks.filter((t) => t.kind === "audio");
  }
}

beforeEach(() => {
  gifInstances.length = 0;
  lastGifOptions.value = undefined;

  vi.stubGlobal("MediaRecorder", MockMediaRecorder);
  vi.stubGlobal("MediaStream", MockMediaStream);
  vi.stubGlobal("requestAnimationFrame", vi.fn().mockReturnValue(1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());

  // test-setup's 2d context mock lacks strokeRect (used to frame the PiP);
  // extend the returned context so compositing does not throw.
  (HTMLCanvasElement.prototype.getContext as ReturnType<typeof vi.fn>) = vi
    .fn()
    .mockReturnValue({
      drawImage: vi.fn(),
      strokeRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
    });

  // captureStream on canvas (used for webcam compositing)
  (
    HTMLCanvasElement.prototype as unknown as {
      captureStream: () => MediaStream;
    }
  ).captureStream = vi
    .fn()
    .mockImplementation(
      () => new MockMediaStream([makeVideoTrack()]) as unknown as MediaStream
    );

  // HTMLVideoElement.play resolves; metadata/seek hooks fire so GIF export runs
  (
    HTMLMediaElement.prototype as unknown as { play: () => Promise<void> }
  ).play = vi.fn().mockResolvedValue(undefined);

  // happy-dom validates srcObject against a real MediaStream; bypass it.
  Object.defineProperty(HTMLMediaElement.prototype, "srcObject", {
    set() {},
    get() {
      return null;
    },
    configurable: true,
  });

  // happy-dom does not emit loadedmetadata/seeked; emulate them so the GIF
  // export path (which seeks frame-by-frame) can run to completion.
  Object.defineProperty(HTMLMediaElement.prototype, "videoWidth", {
    get: () => 320,
    configurable: true,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "videoHeight", {
    get: () => 180,
    configurable: true,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "duration", {
    get: () => 1,
    configurable: true,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "src", {
    set(this: HTMLMediaElement) {
      setTimeout(() => this.onloadedmetadata?.(new Event("loadedmetadata")), 0);
    },
    get() {
      return "blob:mock";
    },
    configurable: true,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
    set(this: HTMLMediaElement) {
      setTimeout(() => this.dispatchEvent(new Event("seeked")), 0);
    },
    get() {
      return 0;
    },
    configurable: true,
  });

  const display = navigator.mediaDevices.getDisplayMedia as ReturnType<
    typeof vi.fn
  >;
  display.mockResolvedValue(
    new MockMediaStream([makeVideoTrack()]) as unknown as MediaStream
  );
  const user = navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>;
  user.mockResolvedValue(
    new MockMediaStream([makeVideoTrack(), makeAudioTrack()]) as unknown as MediaStream
  );
});

describe("ScreenRecorder", () => {
  it("renders the new option controls (webcam, countdown, quality)", () => {
    render(<ScreenRecorder />);
    expect(screen.getByText(/webcam overlay/i)).toBeInTheDocument();
    expect(screen.getByText(/countdown/i)).toBeInTheDocument();
    expect(screen.getByText(/video quality/i)).toBeInTheDocument();
    // Start button present, not recording yet
    expect(
      screen.getByRole("button", { name: /start recording/i })
    ).toBeInTheDocument();
  });

  it("reveals webcam position + size controls when webcam is enabled", async () => {
    const user = userEvent.setup();
    render(<ScreenRecorder />);
    expect(screen.queryByText(/webcam position/i)).not.toBeInTheDocument();
    await user.click(screen.getByTestId("webcam-switch"));
    expect(screen.getByText(/webcam position/i)).toBeInTheDocument();
    expect(screen.getByText(/webcam size/i)).toBeInTheDocument();
  });

  it("transitions to the recording state and back when countdown is off", async () => {
    const user = userEvent.setup();
    render(<ScreenRecorder />);

    // Turn countdown off so recording starts immediately.
    await user.click(screen.getByTestId("countdown-switch"));
    await user.click(screen.getByRole("button", { name: /start recording/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /stop recording/i })
      ).toBeInTheDocument()
    );
    expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /stop recording/i }));

    // Stopping produces a saved recording entry with download/export buttons.
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /export as gif/i })
      ).toBeInTheDocument()
    );
    expect(
      screen.getByRole("button", { name: /download webm/i })
    ).toBeInTheDocument();
  });

  it("composites the webcam via canvas.captureStream when webcam is enabled", async () => {
    const user = userEvent.setup();
    render(<ScreenRecorder />);

    await user.click(screen.getByTestId("countdown-switch"));
    await user.click(screen.getByTestId("webcam-switch"));
    await user.click(screen.getByRole("button", { name: /start recording/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /stop recording/i })
      ).toBeInTheDocument()
    );
    // getUserMedia called for the webcam, and the canvas stream was captured.
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    const captureStream = (
      HTMLCanvasElement.prototype as unknown as {
        captureStream: ReturnType<typeof vi.fn>;
      }
    ).captureStream;
    expect(captureStream).toHaveBeenCalled();
  });

  it("exports a recording to GIF using the self-hosted worker", async () => {
    const user = userEvent.setup();
    render(<ScreenRecorder />);

    await user.click(screen.getByTestId("countdown-switch"));
    await user.click(screen.getByRole("button", { name: /start recording/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /stop recording/i })
      ).toBeInTheDocument()
    );
    await user.click(screen.getByRole("button", { name: /stop recording/i }));

    const exportBtn = await screen.findByRole("button", {
      name: /export as gif/i,
    });
    await user.click(exportBtn);

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    // GIF was constructed with the self-hosted worker path (no CDN).
    expect(gifInstances.length).toBeGreaterThan(0);
    expect(lastGifOptions.value?.workerScript).toBe("/gif.worker.js");
  });
});
