import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AudioTranscriber from "@/components/AudioTranscriber";

// Mock the shared HF runner so tests never load a real Whisper model.
const transcriber = vi.fn().mockResolvedValue({
  text: "Hello world. This is a test.",
  chunks: [
    { timestamp: [0, 1.5], text: " Hello world." },
    { timestamp: [1.5, 3], text: " This is a test." },
  ],
});
const getPipeline = vi.fn().mockResolvedValue(transcriber);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

// Mock Web Audio decode so File.arrayBuffer + decodeAudioData resolve.
const decodeAudioData = vi.fn().mockResolvedValue({
  numberOfChannels: 1,
  length: 16000,
  sampleRate: 16000,
  getChannelData: () => new Float32Array(16000),
});
class MockAudioContext {
  decodeAudioData = decodeAudioData;
  close = vi.fn().mockResolvedValue(undefined);
}
// @ts-expect-error test shim
global.AudioContext = MockAudioContext;

function makeFile() {
  const file = new File(["fake-audio-bytes"], "speech.mp3", {
    type: "audio/mpeg",
  });
  // happy-dom File.arrayBuffer may be missing — provide a stub.
  Object.defineProperty(file, "arrayBuffer", {
    value: () => Promise.resolve(new ArrayBuffer(16)),
    configurable: true,
  });
  return file;
}

beforeEach(() => {
  getPipeline.mockClear();
  transcriber.mockClear();
  decodeAudioData.mockClear();
});

describe("AudioTranscriber", () => {
  it("renders the dropzone and transcribe button", () => {
    render(<AudioTranscriber />);
    expect(
      screen.getByRole("button", { name: /transcribe/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("audio-input")).toBeInTheDocument();
  });

  it("disables transcribe until a file is chosen", () => {
    render(<AudioTranscriber />);
    expect(screen.getByRole("button", { name: /transcribe/i })).toBeDisabled();
    expect(getPipeline).not.toHaveBeenCalled();
  });

  it("uploads a file, transcribes it, and shows the text", async () => {
    const user = userEvent.setup();
    render(<AudioTranscriber />);

    const input = screen.getByTestId("audio-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    await user.click(screen.getByRole("button", { name: /transcribe/i }));

    await waitFor(() =>
      expect(screen.getByTestId("transcript-result")).toBeInTheDocument()
    );

    expect(getPipeline).toHaveBeenCalledWith(
      "automatic-speech-recognition",
      expect.any(String),
      expect.objectContaining({ device: "auto" })
    );
    expect(transcriber).toHaveBeenCalledWith(
      expect.any(Float32Array),
      expect.objectContaining({
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
      })
    );
    expect(screen.getByTestId("transcript-result")).toHaveTextContent(
      /hello world/i
    );
    // Timestamped chunks rendered.
    expect(screen.getAllByTestId("transcript-chunk").length).toBe(2);
  });

  it("exports SRT subtitles built from the timestamped chunks", async () => {
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AudioTranscriber />);

    const input = screen.getByTestId("audio-input") as HTMLInputElement;
    await user.upload(input, makeFile());
    await user.click(screen.getByRole("button", { name: /transcribe/i }));

    await waitFor(() =>
      expect(screen.getByTestId("transcript-result")).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /copy srt/i }));

    expect(writeText).toHaveBeenCalled();
    const srt = writeText.mock.calls[0][0] as string;
    // SRT structure: index, HH:MM:SS,mmm --> HH:MM:SS,mmm, text.
    expect(srt).toMatch(/^1\n00:00:00,000 --> 00:00:01,500\nHello world\./m);
    expect(srt).toContain("This is a test.");
  });
});
