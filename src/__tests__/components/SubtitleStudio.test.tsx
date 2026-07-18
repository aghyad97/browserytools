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

// Mock the offscreen <video> element TranscribePanel creates to read
// videoWidth/videoHeight. happy-dom never fires loadedmetadata, so patch
// createElement to return a stub that resolves it synchronously (next tick).
const realCreateElement = document.createElement.bind(document);
beforeEach(() => {
  getPipeline.mockClear();
  transcriber.mockClear();
  decodeToMono16k.mockClear();

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

  it("uploads a video, transcribes it, and produces a non-empty CueDoc", async () => {
    const user = userEvent.setup();
    render(<SubtitleStudio />);

    const input = screen.getByTestId(
      "subtitle-video-input"
    ) as HTMLInputElement;
    await user.upload(input, makeVideoFile());

    await user.click(screen.getByRole("button", { name: /transcribe/i }));

    await waitFor(() =>
      expect(
        screen.getByTestId("subtitle-studio-transcribed")
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
    // non-empty CueDoc built via fromWhisperWords, plus the dims read from
    // the offscreen <video>.
    expect(
      screen.queryByTestId("transcribe-panel")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("subtitle-studio-cue-count")).toHaveTextContent(
      "1"
    );
    expect(
      screen.getByTestId("subtitle-studio-transcribed")
    ).toHaveTextContent("1920");
  });

  it("renders exactly one h1 (the ToolShell title)", () => {
    render(<SubtitleStudio />);
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });
});
