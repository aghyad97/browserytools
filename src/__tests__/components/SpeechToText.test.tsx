import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeechToText from "@/components/SpeechToText";

// ── Mock SpeechRecognition ────────────────────────────────────────────────────
class MockSpeechRecognition {
  lang = "";
  continuous = false;
  interimResults = false;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn(() => {
    this.onend?.();
  });
  abort = vi.fn();

  // Test helper to push a final result
  emitFinal(text: string) {
    this.onresult?.({
      resultIndex: 0,
      results: [{ isFinal: true, 0: { transcript: text } }],
    });
  }
}

let lastInstance: MockSpeechRecognition | null = null;

function installMock() {
  class Ctor extends MockSpeechRecognition {
    constructor() {
      super();
      lastInstance = this;
    }
  }
  (window as unknown as Record<string, unknown>).SpeechRecognition = Ctor;
  (window as unknown as Record<string, unknown>).webkitSpeechRecognition = Ctor;
}

function removeMock() {
  delete (window as unknown as Record<string, unknown>).SpeechRecognition;
  delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
}

describe("SpeechToText", () => {
  beforeEach(() => {
    lastInstance = null;
    installMock();
  });

  afterEach(() => {
    removeMock();
  });

  it("renders the start button and placeholder transcript", () => {
    render(<SpeechToText />);
    expect(screen.getByTestId("mic-button")).toBeInTheDocument();
    expect(screen.getByTestId("transcript")).toBeInTheDocument();
  });

  it("starts recognition when the mic button is clicked", async () => {
    const user = userEvent.setup();
    render(<SpeechToText />);

    await user.click(screen.getByTestId("mic-button"));

    expect(lastInstance).not.toBeNull();
    expect(lastInstance!.start).toHaveBeenCalled();
    // button now shows stop affordance
    expect(screen.getByTestId("mic-button")).toHaveAttribute(
      "aria-label",
      "Stop"
    );
  });

  it("stops recognition when clicked again", async () => {
    const user = userEvent.setup();
    render(<SpeechToText />);

    const button = screen.getByTestId("mic-button");
    await user.click(button);
    await user.click(button);

    expect(lastInstance!.stop).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByTestId("mic-button")).toHaveAttribute(
        "aria-label",
        "Start dictation"
      )
    );
  });

  it("renders the recognized transcript", async () => {
    const user = userEvent.setup();
    render(<SpeechToText />);

    await user.click(screen.getByTestId("mic-button"));
    lastInstance!.emitFinal("hello world");

    const transcript = screen.getByTestId("transcript") as HTMLTextAreaElement;
    await waitFor(() => expect(transcript.value).toContain("hello world"));
  });

  it("copies the transcript to the clipboard", async () => {
    const user = userEvent.setup();
    render(<SpeechToText />);

    await user.click(screen.getByTestId("mic-button"));
    lastInstance!.emitFinal("copy me please");

    const transcript = screen.getByTestId("transcript") as HTMLTextAreaElement;
    await waitFor(() => expect(transcript.value).toContain("copy me please"));

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("copy me please"));
  });

  it("shows the unsupported-browser message when the API is missing", () => {
    removeMock();
    render(<SpeechToText />);
    expect(screen.getByTestId("unsupported-notice")).toBeInTheDocument();
    expect(screen.getByTestId("mic-button")).toBeDisabled();
  });
});
