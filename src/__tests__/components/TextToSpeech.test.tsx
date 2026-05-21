import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextToSpeech from "@/components/TextToSpeech";

// ── Mock speechSynthesis + SpeechSynthesisUtterance ──────────────────────────
const speakMock = vi.fn();
const cancelMock = vi.fn();
const pauseMock = vi.fn();
const resumeMock = vi.fn();
const getVoicesMock = vi.fn(() => [
  { voiceURI: "voice-en", name: "English Voice", lang: "en-US", default: true, localService: true },
  { voiceURI: "voice-ar", name: "Arabic Voice", lang: "ar-SA", default: false, localService: true },
]);

class MockUtterance {
  text: string;
  voice: unknown = null;
  rate = 1;
  pitch = 1;
  volume = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

beforeEach(() => {
  speakMock.mockClear();
  cancelMock.mockClear();
  pauseMock.mockClear();
  resumeMock.mockClear();

  Object.defineProperty(window, "speechSynthesis", {
    value: {
      speak: speakMock,
      cancel: cancelMock,
      pause: pauseMock,
      resume: resumeMock,
      getVoices: getVoicesMock,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    writable: true,
    configurable: true,
  });

  // @ts-expect-error - assign mock constructor
  window.SpeechSynthesisUtterance = MockUtterance;
});

describe("TextToSpeech", () => {
  it("renders the voice selector and rate/pitch/volume controls", () => {
    render(<TextToSpeech />);
    expect(screen.getByText("Voice")).toBeInTheDocument();
    expect(screen.getByLabelText("Rate")).toBeInTheDocument();
    expect(screen.getByLabelText("Pitch")).toBeInTheDocument();
    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
  });

  it("calls speak() when Play is pressed with text", async () => {
    const user = userEvent.setup();
    render(<TextToSpeech />);

    const textarea = screen.getByPlaceholderText(/Type or paste/i);
    await user.type(textarea, "Hello world");

    await user.click(screen.getByRole("button", { name: /Play/i }));

    expect(speakMock).toHaveBeenCalledTimes(1);
    const utterance = speakMock.mock.calls[0][0] as MockUtterance;
    expect(utterance.text).toBe("Hello world");
  });

  it("does not speak when text is empty", async () => {
    const user = userEvent.setup();
    render(<TextToSpeech />);
    await user.click(screen.getByRole("button", { name: /Play/i }));
    expect(speakMock).not.toHaveBeenCalled();
  });

  it("calls cancel() when Stop is pressed", async () => {
    const user = userEvent.setup();
    render(<TextToSpeech />);

    const textarea = screen.getByPlaceholderText(/Type or paste/i);
    await user.type(textarea, "Read me");
    await user.click(screen.getByRole("button", { name: /Play/i }));

    cancelMock.mockClear();
    await user.click(screen.getByRole("button", { name: /Stop/i }));
    expect(cancelMock).toHaveBeenCalled();
  });

  it("calls pause() and resume() across the control lifecycle", async () => {
    const user = userEvent.setup();
    render(<TextToSpeech />);

    const textarea = screen.getByPlaceholderText(/Type or paste/i);
    await user.type(textarea, "Pause me");
    await user.click(screen.getByRole("button", { name: /Play/i }));

    await user.click(screen.getByRole("button", { name: /Pause/i }));
    expect(pauseMock).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /Resume/i }));
    expect(resumeMock).toHaveBeenCalled();
  });

  it("shows an unsupported message when speechSynthesis is missing", () => {
    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    render(<TextToSpeech />);
    expect(screen.getByText(/does not support the Web Speech API/i)).toBeInTheDocument();
  });
});
