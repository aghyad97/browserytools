import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AudioEditor from "@/components/AudioEditor";
import { useAudioStore } from "@/store/audio-store";

// happy-dom's HTMLMediaElement never fires "loadedmetadata"; stub a minimal
// Audio class whose metadata is available on the next tick. Duration differs
// per instance so tests can tell the first vs. second loaded file apart.
let audioInstanceCount = 0;
class MockAudio {
  src: string;
  duration = 0;
  paused = true;
  volume = 1;
  playbackRate = 1;
  currentTime = 0;
  private listeners: Record<string, Array<() => void>> = {};
  constructor(src: string) {
    this.src = src;
    audioInstanceCount += 1;
    this.duration = audioInstanceCount === 1 ? 10 : 20;
  }
  addEventListener(event: string, cb: () => void) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(cb);
    if (event === "loadedmetadata") {
      setTimeout(() => cb(), 0);
    }
  }
  play() {
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
}
vi.stubGlobal("Audio", MockAudio);

// Mock Web Audio decode so initializeAudioContext resolves and drawWaveform runs.
const decodeAudioData = vi.fn().mockResolvedValue({
  numberOfChannels: 1,
  length: 8,
  sampleRate: 8000,
  getChannelData: () => new Float32Array(8),
});
class MockAudioContext {
  decodeAudioData = decodeAudioData;
  createGain = () => ({ connect: vi.fn(), gain: { value: 1 } });
  close = vi.fn().mockResolvedValue(undefined);
}
vi.stubGlobal("AudioContext", MockAudioContext);

function makeFile(name: string) {
  const file = new File(["fake-audio-bytes"], name, { type: "audio/mpeg" });
  Object.defineProperty(file, "arrayBuffer", {
    value: () => Promise.resolve(new ArrayBuffer(8)),
    configurable: true,
  });
  return file;
}

beforeEach(() => {
  audioInstanceCount = 0;
  decodeAudioData.mockClear();
  useAudioStore.setState({
    audioFile: null,
    audioBuffer: null,
    isPlaying: false,
    volume: 1,
    duration: 0,
    currentTime: 0,
    speed: 1,
  });
});

async function uploadAudio(input: HTMLInputElement, name: string) {
  const user = userEvent.setup();
  await user.upload(input, makeFile(name));
  await screen.findByText(name);
  return user;
}

describe("AudioEditor", () => {
  it("renders the upload prompt with no Change control before any file loads", () => {
    render(<AudioEditor />);
    expect(screen.getByText(/drop audio file here/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /change/i })
    ).not.toBeInTheDocument();
  });

  it("shows a Change control once a file is loaded", async () => {
    render(<AudioEditor />);
    const input = document.getElementById(
      "audio-upload"
    ) as HTMLInputElement;
    await uploadAudio(input, "a.mp3");

    expect(
      screen.getByRole("button", { name: /change/i })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("10 seconds")).toBeInTheDocument()
    );
  });

  it("swaps the file and clears stale playback/duration state on Change", async () => {
    render(<AudioEditor />);
    const input = document.getElementById(
      "audio-upload"
    ) as HTMLInputElement;
    const user = await uploadAudio(input, "a.mp3");
    await waitFor(() =>
      expect(screen.getByText("10 seconds")).toBeInTheDocument()
    );

    // Start playback on the first file — this is the state that must not
    // silently persist once the file underneath it changes.
    await user.click(screen.getByTestId("audio-play-pause"));
    await waitFor(() => expect(useAudioStore.getState().isPlaying).toBe(true));

    // Swap via the Change control.
    const changeBtn = screen.getByRole("button", { name: /change/i });
    await user.click(changeBtn);
    const changeInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await user.upload(changeInput, makeFile("b.mp3"));

    // The new file replaces the old one in the info row.
    await screen.findByText("b.mp3");
    expect(screen.queryByText("a.mp3")).not.toBeInTheDocument();

    // Stale playback state from the previous file must be cleared, not
    // carried over onto the new file.
    expect(useAudioStore.getState().isPlaying).toBe(false);
    expect(useAudioStore.getState().currentTime).toBe(0);

    // Duration reflects the newly loaded file, not the stale first value.
    await waitFor(() =>
      expect(screen.getByText("20 seconds")).toBeInTheDocument()
    );
    expect(screen.queryByText("10 seconds")).not.toBeInTheDocument();
  });
});
