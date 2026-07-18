import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PreviewStage } from "@/components/subtitle-studio/PreviewStage";
import type { CueDoc } from "@/lib/subtitles/cues";
import type { CaptionStyle } from "@/lib/subtitles/styles";

// Fake JASSUB handle — never touches the real jassub/wasm worker. Assert
// against these spies instead of the real (unmockable-in-happy-dom) API.
const setAss = vi.fn();
const destroy = vi.fn();
const mountPreview = vi.fn(
  (_video: HTMLVideoElement, _canvas: HTMLCanvasElement, _ass: string) => ({ setAss, destroy })
);

vi.mock("@/lib/subtitles/jassub", () => ({
  mountPreview: (video: HTMLVideoElement, canvas: HTMLCanvasElement, ass: string) =>
    mountPreview(video, canvas, ass),
}));

// Sentinel that varies with the style's primary color, so a style change
// produces a distinguishable-from-the-mount ASS string.
vi.mock("@/lib/subtitles/ass", () => ({
  toAss: vi.fn((_doc: CueDoc, style: CaptionStyle) => `ass:${style.primary}`),
}));

import { toAss } from "@/lib/subtitles/ass";

function makeFile(name = "clip.mp4"): File {
  return new File(["fake video bytes"], name, { type: "video/mp4" });
}

function makeDoc(): CueDoc {
  return [{ id: "a", start: 0, end: 2, text: "hello" }];
}

function makeStyle(overrides: Partial<CaptionStyle> = {}): CaptionStyle {
  return {
    fontName: "Arial",
    fontSize: 48,
    primary: "#FFFFFF",
    highlight: "#FFD400",
    outline: "#000000",
    back: "#000000",
    outlineWidth: 2,
    shadow: 0,
    bold: false,
    alignment: 2,
    marginV: 40,
    box: false,
    animation: "none",
    ...overrides,
  };
}

const DIMS = { w: 1280, h: 720 };

beforeEach(() => {
  mountPreview.mockClear();
  setAss.mockClear();
  destroy.mockClear();
  vi.mocked(toAss).mockClear();
  // happy-dom's HTMLMediaElement has no play(); stub it so the transport
  // button never throws if a test exercises it.
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
});

describe("PreviewStage", () => {
  it("mounts JASSUB exactly once on render, passing the video/canvas and the toAss output", () => {
    const file = makeFile();
    render(<PreviewStage file={file} doc={makeDoc()} style={makeStyle()} dims={DIMS} />);

    expect(mountPreview).toHaveBeenCalledTimes(1);
    const [video, canvas, ass] = mountPreview.mock.calls[0];
    expect(video).toBeInstanceOf(HTMLVideoElement);
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(ass).toBe("ass:#FFFFFF");
    expect(setAss).not.toHaveBeenCalled();
  });

  it("re-computes the ASS and calls setAss (not a second mountPreview) when style changes", () => {
    const file = makeFile();
    const doc = makeDoc();
    const { rerender } = render(
      <PreviewStage file={file} doc={doc} style={makeStyle()} dims={DIMS} />
    );
    expect(mountPreview).toHaveBeenCalledTimes(1);

    const nextStyle = makeStyle({ primary: "#FF0000" });
    rerender(<PreviewStage file={file} doc={doc} style={nextStyle} dims={DIMS} />);

    expect(mountPreview).toHaveBeenCalledTimes(1);
    expect(setAss).toHaveBeenCalledTimes(1);
    expect(setAss).toHaveBeenCalledWith("ass:#FF0000");
  });

  it("re-computes the ASS and calls setAss (not a second mountPreview) when doc changes", () => {
    const file = makeFile();
    const style = makeStyle();
    const { rerender } = render(
      <PreviewStage file={file} doc={makeDoc()} style={style} dims={DIMS} />
    );
    expect(mountPreview).toHaveBeenCalledTimes(1);

    const nextDoc: CueDoc = [{ id: "b", start: 0, end: 3, text: "a new cue" }];
    rerender(<PreviewStage file={file} doc={nextDoc} style={style} dims={DIMS} />);

    expect(mountPreview).toHaveBeenCalledTimes(1);
    expect(setAss).toHaveBeenCalledTimes(1);
  });

  it("does not call setAss on a re-render with unchanged doc/style", () => {
    const file = makeFile();
    const doc = makeDoc();
    const style = makeStyle();
    const { rerender } = render(
      <PreviewStage file={file} doc={doc} style={style} dims={DIMS} />
    );
    expect(mountPreview).toHaveBeenCalledTimes(1);

    rerender(<PreviewStage file={file} doc={doc} style={style} dims={DIMS} />);

    expect(mountPreview).toHaveBeenCalledTimes(1);
    expect(setAss).not.toHaveBeenCalled();
  });

  it("destroys the JASSUB handle exactly once on unmount", () => {
    const file = makeFile();
    const { unmount } = render(
      <PreviewStage file={file} doc={makeDoc()} style={makeStyle()} dims={DIMS} />
    );

    unmount();

    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("revokes the object URL on unmount", () => {
    const file = makeFile();
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL");
    const { unmount } = render(
      <PreviewStage file={file} doc={makeDoc()} style={makeStyle()} dims={DIMS} />
    );

    unmount();

    expect(revokeSpy).toHaveBeenCalled();
  });

  it("re-issues a fresh object URL after a StrictMode simulated cleanup+remount", () => {
    // Regression test for the StrictMode double-invoke bug: React's dev-mode
    // simulated unmount runs the object-URL effect's cleanup (revoke) then
    // immediately re-runs its setup (create) against the SAME `file` prop.
    // A fix that recomputes the url only when `file` changes (e.g. a
    // useMemo) would fail to reissue on the second setup, leaving <video>
    // pointed at an already-revoked blob. test-setup.ts stubs
    // createObjectURL to always return the same string, which would mask
    // this bug — so this test overrides it locally with distinct URLs.
    const file = makeFile();
    const urls = ["blob:first", "blob:second"];
    let call = 0;
    const createSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockImplementation(() => urls[call++] ?? "blob:overflow");
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

    try {
      render(
        <StrictMode>
          <PreviewStage file={file} doc={makeDoc()} style={makeStyle()} dims={DIMS} />
        </StrictMode>
      );

      expect(createSpy).toHaveBeenCalledTimes(2);
      expect(revokeSpy).toHaveBeenCalledWith("blob:first");

      const video = screen.getByTestId("preview-video") as HTMLVideoElement;
      expect(video.src).toContain("blob:second");
    } finally {
      createSpy.mockRestore();
      revokeSpy.mockRestore();
    }
  });

  it("destroys the old handle and mounts a fresh one when the file changes", () => {
    const doc = makeDoc();
    const style = makeStyle();
    const { rerender } = render(
      <PreviewStage file={makeFile("a.mp4")} doc={doc} style={style} dims={DIMS} />
    );
    expect(mountPreview).toHaveBeenCalledTimes(1);
    expect(destroy).not.toHaveBeenCalled();

    rerender(<PreviewStage file={makeFile("b.mp4")} doc={doc} style={style} dims={DIMS} />);

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(mountPreview).toHaveBeenCalledTimes(2);
  });
});
