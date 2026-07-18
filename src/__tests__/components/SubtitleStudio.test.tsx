import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubtitleStudio from "@/components/SubtitleStudio";

// Mock the shared HF runner so tests never load a real Whisper model. Word-
// level chunks (the shape returned when return_timestamps: "word") — mirrors
// the transformers.js docs example.
const transcriber = vi.fn().mockResolvedValue({
  text: " Hello world.",
  chunks: [
    { text: " Hello", timestamp: [0, 0.5] },
    { text: " world.", timestamp: [0.5, 1.2] },
  ],
});
const getPipeline = vi.fn().mockResolvedValue(transcriber);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

// Mock the audio decoder used by TranscribePanel — never exercise real Web
// Audio decoding in tests.
const decodeToMono16k = vi.fn().mockResolvedValue(new Float32Array(16000));
vi.mock("@/lib/media/decode-audio", () => ({
  decodeToMono16k: (...args: unknown[]) => decodeToMono16k(...args),
}));

// Mock JASSUB — once a transcript exists SubtitleStudio composes in
// PreviewStage, which mounts a real JASSUB worker/wasm instance. happy-dom
// can't run that, so stub it exactly like PreviewStage's own test does.
const setAss = vi.fn();
const destroy = vi.fn();
const mountPreview = vi.fn(
  (_video: HTMLVideoElement, _canvas: HTMLCanvasElement, _ass: string) => ({
    setAss,
    destroy,
  })
);
vi.mock("@/lib/subtitles/jassub", () => ({
  mountPreview: (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ass: string
  ) => mountPreview(video, canvas, ass),
}));

// Mock the offscreen <video> element TranscribePanel creates to read
// videoWidth/videoHeight. happy-dom never fires loadedmetadata, so patch
// createElement to return a stub that resolves it synchronously (next tick).
const realCreateElement = document.createElement.bind(document);
beforeEach(() => {
  getPipeline.mockClear();
  transcriber.mockClear();
  decodeToMono16k.mockClear();
  mountPreview.mockClear();
  setAss.mockClear();
  destroy.mockClear();

  // happy-dom's HTMLMediaElement has no play(); PreviewStage's transport
  // controls call it, so stub it the same way PreviewStage's own test does.
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });

  vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
    const el = realCreateElement(tag);
    if (tag === "video") {
      Object.defineProperty(el, "videoWidth", {
        configurable: true,
        get: () => 1920,
      });
      Object.defineProperty(el, "videoHeight", {
        configurable: true,
        get: () => 1080,
      });
      Object.defineProperty(el, "duration", {
        configurable: true,
        get: () => 5,
      });
      Object.defineProperty(el, "src", {
        configurable: true,
        set: () => {
          setTimeout(() => {
            (el as HTMLVideoElement).onloadedmetadata?.(new Event("loaded"));
          }, 0);
        },
        get: () => "blob:mock-url",
      });
    }
    return el;
  });
});

function makeVideoFile() {
  const file = new File(["fake-video-bytes"], "clip.mp4", {
    type: "video/mp4",
  });
  Object.defineProperty(file, "arrayBuffer", {
    value: () => Promise.resolve(new ArrayBuffer(16)),
    configurable: true,
  });
  return file;
}

describe("SubtitleStudio", () => {
  it("renders the transcribe panel by default", () => {
    render(<SubtitleStudio />);
    expect(screen.getByTestId("transcribe-panel")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /transcribe/i })
    ).toBeDisabled();
  });

  it("uploads a video, transcribes it, and composes the full studio (preview, style, cue editor, export)", async () => {
    const user = userEvent.setup();
    render(<SubtitleStudio />);

    const input = screen.getByTestId(
      "subtitle-video-input"
    ) as HTMLInputElement;
    await user.upload(input, makeVideoFile());

    await user.click(screen.getByRole("button", { name: /transcribe/i }));

    await waitFor(() =>
      expect(
        screen.getByTestId("subtitle-studio-editor")
      ).toBeInTheDocument()
    );

    // Word-level timestamps requested (karaoke needs it).
    expect(getPipeline).toHaveBeenCalledWith(
      "automatic-speech-recognition",
      expect.any(String),
      expect.objectContaining({ device: "auto" })
    );
    expect(transcriber).toHaveBeenCalledWith(
      expect.any(Float32Array),
      expect.objectContaining({ return_timestamps: "word" })
    );

    // The transcribe panel hands off to SubtitleStudio's own state: a
    // non-empty CueDoc built via fromWhisperWords, the dims read from the
    // offscreen <video>, and every downstream panel composed in.
    expect(
      screen.queryByTestId("transcribe-panel")
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId("cue-row")).toHaveLength(1);
    expect(screen.getByTestId("style-panel")).toBeInTheDocument();
    expect(screen.getByTestId("export-panel")).toBeInTheDocument();

    // Dims (1920x1080 from the offscreen <video> stub) reached PreviewStage
    // and fed into the ASS it mounts (PlayResX/PlayResY are the dims).
    expect(mountPreview).toHaveBeenCalledTimes(1);
    const [, , ass] = mountPreview.mock.calls[0];
    expect(ass).toContain("1920");
    expect(ass).toContain("1080");
  });

  it("start over returns to the transcribe panel", async () => {
    const user = userEvent.setup();
    render(<SubtitleStudio />);

    const input = screen.getByTestId(
      "subtitle-video-input"
    ) as HTMLInputElement;
    await user.upload(input, makeVideoFile());
    await user.click(screen.getByRole("button", { name: /transcribe/i }));

    await waitFor(() =>
      expect(
        screen.getByTestId("subtitle-studio-editor")
      ).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /start over/i }));

    expect(screen.getByTestId("transcribe-panel")).toBeInTheDocument();
    expect(
      screen.queryByTestId("subtitle-studio-editor")
    ).not.toBeInTheDocument();
  });

  it("renders exactly one h1 (the ToolShell title)", () => {
    render(<SubtitleStudio />);
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });
});
