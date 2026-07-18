import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExportPanel } from "@/components/subtitle-studio/ExportPanel";
import { buildSrt, buildVtt, type CueDoc } from "@/lib/subtitles/cues";
import { PRESETS } from "@/lib/subtitles/styles";

// Mock the burn pipeline so no real ffmpeg/JASSUB work ever runs in this
// test — we only care that ExportPanel calls it with the right args and
// reacts correctly to its resolve/reject/envelope status.
const burnMp4 = vi.fn();
const envelopeStatus = vi.fn();
vi.mock("@/lib/subtitles/burn", () => ({
  burnMp4: (...args: unknown[]) => burnMp4(...args),
  envelopeStatus: (...args: unknown[]) => envelopeStatus(...args),
}));

// Mock the shared download pathway — never touch a real anchor/click in
// happy-dom.
const downloadText = vi.fn();
const downloadBlob = vi.fn();
vi.mock("@/lib/download", () => ({
  downloadText: (...args: unknown[]) => downloadText(...args),
  downloadBlob: (...args: unknown[]) => downloadBlob(...args),
}));

function makeFile(name = "clip.mp4"): File {
  return new File(["fake video bytes"], name, { type: "video/mp4" });
}

function makeDoc(): CueDoc {
  return [{ id: "a", start: 0, end: 2, text: "hello world" }];
}

const DIMS = { w: 1280, h: 720 };
const STYLE = PRESETS["clean-caption"];

beforeEach(() => {
  burnMp4.mockReset();
  envelopeStatus.mockReset();
  downloadText.mockClear();
  downloadBlob.mockClear();
});

describe("ExportPanel", () => {
  it("SRT click downloads the buildSrt output with an .srt filename derived from the video name", async () => {
    envelopeStatus.mockReturnValue("ok");
    const user = userEvent.setup();
    const doc = makeDoc();
    render(
      <ExportPanel file={makeFile()} doc={doc} style={STYLE} dims={DIMS} duration={10} />
    );

    await user.click(screen.getByTestId("export-srt"));

    expect(downloadText).toHaveBeenCalledWith(buildSrt(doc), "clip.srt");
  });

  it("VTT click downloads the buildVtt output with a .vtt filename derived from the video name", async () => {
    envelopeStatus.mockReturnValue("ok");
    const user = userEvent.setup();
    const doc = makeDoc();
    render(
      <ExportPanel file={makeFile()} doc={doc} style={STYLE} dims={DIMS} duration={10} />
    );

    await user.click(screen.getByTestId("export-vtt"));

    expect(downloadText).toHaveBeenCalledWith(buildVtt(doc), "clip.vtt");
  });

  it("disables the MP4 button and shows the honest blocked message when envelopeStatus is blocked, without calling burnMp4", () => {
    envelopeStatus.mockReturnValue("blocked");
    render(
      <ExportPanel
        file={makeFile()}
        doc={makeDoc()}
        style={STYLE}
        dims={DIMS}
        duration={9999}
      />
    );

    expect(screen.getByTestId("export-mp4")).toBeDisabled();
    expect(screen.getByTestId("export-blocked-message")).toBeInTheDocument();
    expect(burnMp4).not.toHaveBeenCalled();
  });

  it("shows a warning banner but keeps the MP4 button enabled when envelopeStatus is warn", () => {
    envelopeStatus.mockReturnValue("warn");
    render(
      <ExportPanel file={makeFile()} doc={makeDoc()} style={STYLE} dims={DIMS} duration={400} />
    );

    expect(screen.getByTestId("export-warn-banner")).toBeInTheDocument();
    expect(screen.getByTestId("export-mp4")).not.toBeDisabled();
  });

  it("burns and downloads the MP4 with an .mp4 filename when envelopeStatus is ok", async () => {
    envelopeStatus.mockReturnValue("ok");
    const blob = new Blob(["fake-mp4"], { type: "video/mp4" });
    burnMp4.mockResolvedValue(blob);
    const user = userEvent.setup();
    render(
      <ExportPanel file={makeFile()} doc={makeDoc()} style={STYLE} dims={DIMS} duration={10} />
    );

    await user.click(screen.getByTestId("export-mp4"));

    await waitFor(() => expect(downloadBlob).toHaveBeenCalledWith(blob, "clip.mp4"));
    expect(burnMp4).toHaveBeenCalledWith(
      expect.objectContaining({ dims: DIMS, duration: 10 })
    );
  });

  it("surfaces an honest error and re-enables the button when burnMp4 throws, without downloading", async () => {
    envelopeStatus.mockReturnValue("ok");
    burnMp4.mockRejectedValue(new Error("boom"));
    const user = userEvent.setup();
    render(
      <ExportPanel file={makeFile()} doc={makeDoc()} style={STYLE} dims={DIMS} duration={10} />
    );

    await user.click(screen.getByTestId("export-mp4"));

    await waitFor(() => expect(screen.getByTestId("export-mp4")).not.toBeDisabled());
    expect(screen.getByTestId("export-error")).toBeInTheDocument();
    expect(downloadBlob).not.toHaveBeenCalled();
  });
});
