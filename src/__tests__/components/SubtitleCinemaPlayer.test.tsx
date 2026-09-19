import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubtitleCinemaPlayer from "@/components/SubtitleCinemaPlayer";

describe("SubtitleCinemaPlayer", () => {
  it("loads and presents an SRT without requiring a video", async () => {
    const user = userEvent.setup();
    render(<SubtitleCinemaPlayer />);
    const file = new File(["1\n00:00:00,000 --> 00:00:02,000\nHello cinema\n"], "captions.srt", { type: "text/plain" });
    await user.upload(screen.getByLabelText("Choose SRT subtitle file"), file);
    expect(await screen.findByText("1 cues loaded")).toBeInTheDocument();
    expect(screen.getByText("SRT-only cinema mode — use play to step through your transcript.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("exposes subtitle styling controls and highlights the active transcript cue", async () => {
    const user = userEvent.setup();
    render(<SubtitleCinemaPlayer />);
    const file = new File(["1\n00:00:00,000 --> 00:02:00,000\nActive cue\n"], "captions.srt", { type: "text/plain" });
    await user.upload(screen.getByLabelText("Choose SRT subtitle file"), file);
    expect(screen.getByLabelText("Subtitle text size")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtitle text color")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtitle background color")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtitle background opacity")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtitle position")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtitle font family")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Active cue/ }));
    expect(screen.getAllByText("Active cue")[1].closest("button")).toHaveClass("text-primary");
  });

  it("supports dedicated SRT seek buttons and keyboard shortcuts", async () => {
    const user = userEvent.setup();
    render(<SubtitleCinemaPlayer />);
    const file = new File(["1\n00:00:00,000 --> 00:00:20,000\nLong cue\n"], "captions.srt", { type: "text/plain" });
    await user.upload(screen.getByLabelText("Choose SRT subtitle file"), file);

    await user.click(screen.getByRole("button", { name: "Seek forward 5 seconds" }));
    expect(screen.getByLabelText("Video progress")).toHaveValue("5");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByLabelText("Video progress")).toHaveValue("4");
    await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
    expect(screen.getByLabelText("Video progress")).toHaveValue("9");
    await user.click(screen.getByRole("button", { name: "Seek backward 1 second" }));
    expect(screen.getByLabelText("Video progress")).toHaveValue("8");
  });
});
