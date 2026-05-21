import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextToSpeech from "@/components/TextToSpeech";

// The component synthesizes both playback and download through the same AI
// voice via this module — mock it to avoid loading the CDN engine.
const synthesizeSpeech = vi
  .fn()
  .mockResolvedValue(new Blob(["RIFFmockwav"], { type: "audio/wav" }));
vi.mock("@/lib/vits-loader", () => ({
  synthesizeSpeech: (...args: unknown[]) => synthesizeSpeech(...args),
}));

beforeEach(() => {
  synthesizeSpeech.mockClear();
  // happy-dom doesn't implement media playback — stub it.
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLMediaElement.prototype.pause = vi.fn();
});

describe("TextToSpeech", () => {
  it("renders the text input and a voice selector", () => {
    render(<TextToSpeech />);
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows an error when playing with no text", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<TextToSpeech />);
    await user.click(screen.getByRole("button", { name: /play|preparing/i }));
    expect(toast.error).toHaveBeenCalled();
    expect(synthesizeSpeech).not.toHaveBeenCalled();
  });

  it("synthesizes and plays the selected AI voice", async () => {
    const user = userEvent.setup();
    render(<TextToSpeech />);
    await user.type(screen.getByRole("textbox"), "Hello world");
    await user.click(screen.getByRole("button", { name: /play|preparing/i }));

    await waitFor(() => expect(synthesizeSpeech).toHaveBeenCalledTimes(1));
    expect(synthesizeSpeech.mock.calls[0][0]).toBe("Hello world");
    expect(typeof synthesizeSpeech.mock.calls[0][1]).toBe("string");
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("downloads a WAV using the same voice", async () => {
    const user = userEvent.setup();
    render(<TextToSpeech />);
    await user.type(screen.getByRole("textbox"), "Save me");

    const { toast } = await import("sonner");
    await user.click(screen.getByRole("button", { name: /download/i }));

    await waitFor(() => expect(synthesizeSpeech).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});
