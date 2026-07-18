import { describe, it, expect, vi, beforeEach } from "vitest";

// Fake FFmpeg — captures writeFile/exec/readFile calls in order so we can
// assert the EXACT arg sequence the Task-1 spike proved works
// (docs/superpowers/specs/2026-07-18-wave-5-spike-findings.md). Never a
// real encode.
interface FakeFfmpeg {
  writeFile: ReturnType<typeof vi.fn>;
  exec: ReturnType<typeof vi.fn>;
  readFile: ReturnType<typeof vi.fn>;
  deleteFile: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
}

function makeFakeFfmpeg(): FakeFfmpeg {
  return {
    writeFile: vi.fn().mockResolvedValue(true),
    exec: vi.fn().mockResolvedValue(0),
    readFile: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
    deleteFile: vi.fn().mockResolvedValue(true),
    on: vi.fn(),
    off: vi.fn(),
  };
}

let fakeFfmpeg = makeFakeFfmpeg();
const getFFmpeg = vi.fn(async () => fakeFfmpeg);

vi.mock("@/lib/media/ffmpeg", () => ({
  getFFmpeg,
}));

// The JASSUB rasterizer talks to a real worker + wasm in production — mock
// it entirely so the test never touches JASSUB or canvas readback.
const rasterizeCaptionFrames = vi.fn(async (_opts: unknown) => [
  new Uint8Array([9, 9]),
  new Uint8Array([8, 8]),
]);

vi.mock("@/lib/subtitles/rasterize", () => ({
  rasterizeCaptionFrames,
}));

const {
  burnMp4,
  envelopeStatus,
  EXPORT_LIMITS,
  BurnEnvelopeExceededError,
} = await import("@/lib/subtitles/burn");

beforeEach(() => {
  fakeFfmpeg = makeFakeFfmpeg();
  getFFmpeg.mockClear();
  getFFmpeg.mockImplementation(async () => fakeFfmpeg);
  rasterizeCaptionFrames.mockClear();
});

function fakeVideoFile(): File {
  return new File([new Uint8Array([1, 2, 3])], "clip.mp4", {
    type: "video/mp4",
  });
}

describe("envelopeStatus", () => {
  it("is ok well under every threshold", () => {
    expect(envelopeStatus(60, 720)).toBe("ok");
  });

  it("is ok exactly AT warnSeconds/warnHeight (thresholds are exclusive)", () => {
    expect(envelopeStatus(EXPORT_LIMITS.warnSeconds, EXPORT_LIMITS.warnHeight - 1)).toBe(
      "ok"
    );
  });

  it("warns once duration passes warnSeconds", () => {
    expect(envelopeStatus(EXPORT_LIMITS.warnSeconds + 1, 720)).toBe("warn");
  });

  it("warns at warnHeight regardless of duration", () => {
    expect(envelopeStatus(10, EXPORT_LIMITS.warnHeight)).toBe("warn");
  });

  it("is ok exactly AT maxSeconds (not blocked yet)", () => {
    expect(envelopeStatus(EXPORT_LIMITS.maxSeconds, 480)).toBe("warn");
  });

  it("blocks once duration passes maxSeconds", () => {
    expect(envelopeStatus(EXPORT_LIMITS.maxSeconds + 1, 480)).toBe("blocked");
  });

  it("blocks at maxSeconds regardless of a low height", () => {
    expect(envelopeStatus(EXPORT_LIMITS.maxSeconds + 1, 360)).toBe("blocked");
  });
});

describe("burnMp4", () => {
  it("throws BurnEnvelopeExceededError when blocked, without touching ffmpeg or the rasterizer", async () => {
    await expect(
      burnMp4({
        videoFile: fakeVideoFile(),
        ass: "dummy ass",
        dims: { w: 1280, h: 720 },
        duration: EXPORT_LIMITS.maxSeconds + 1,
      })
    ).rejects.toBeInstanceOf(BurnEnvelopeExceededError);

    expect(rasterizeCaptionFrames).not.toHaveBeenCalled();
    expect(getFFmpeg).not.toHaveBeenCalled();
  });

  it("runs the JASSUB-rasterize -> ffmpeg-overlay pipeline and returns an MP4 Blob", async () => {
    const onProgress = vi.fn();

    const result = await burnMp4({
      videoFile: fakeVideoFile(),
      ass: "dummy ass",
      dims: { w: 1280, h: 720 },
      duration: 0.25,
      onProgress,
    });

    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe("video/mp4");

    // Rasterizer invoked with the ASS + dims + duration, at a caption fps
    // (independent of the video's own fps).
    expect(rasterizeCaptionFrames).toHaveBeenCalledWith(
      expect.objectContaining({
        ass: "dummy ass",
        dims: { w: 1280, h: 720 },
        duration: 0.25,
        fps: expect.any(Number),
      })
    );

    // Progress wiring mirrors CompressVideo.tsx: subscribe before exec,
    // unsubscribe in a finally.
    expect(fakeFfmpeg.on).toHaveBeenCalledWith("progress", expect.any(Function));
    expect(fakeFfmpeg.off).toHaveBeenCalledWith("progress", expect.any(Function));

    // writeFile: source video bytes first, then each caption PNG in order.
    const writeCalls = fakeFfmpeg.writeFile.mock.calls;
    expect(writeCalls[0][0]).toBe("input.mp4");
    expect(writeCalls[0][1]).toBeInstanceOf(Uint8Array);
    expect(writeCalls[1]).toEqual(["cap0000.png", new Uint8Array([9, 9])]);
    expect(writeCalls[2]).toEqual(["cap0001.png", new Uint8Array([8, 8])]);

    // The EXACT arg sequence from the spike findings: -framerate/
    // -start_number (input options) precede the image-sequence -i, which
    // follows the video -i; overlay respects PNG alpha; output is
    // H.264/yuv420p with source AAC audio copied through.
    expect(fakeFfmpeg.exec).toHaveBeenCalledWith([
      "-i",
      "input.mp4",
      "-framerate",
      "8",
      "-start_number",
      "0",
      "-i",
      "cap%04d.png",
      "-filter_complex",
      "[0:v][1:v]overlay=0:0:format=auto",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "copy",
      "-shortest",
      "output.mp4",
    ]);

    expect(fakeFfmpeg.readFile).toHaveBeenCalledWith("output.mp4");

    // exec must run AFTER every writeFile, and readFile AFTER exec.
    const execOrder = fakeFfmpeg.exec.mock.invocationCallOrder[0];
    const readOrder = fakeFfmpeg.readFile.mock.invocationCallOrder[0];
    for (const order of fakeFfmpeg.writeFile.mock.invocationCallOrder) {
      expect(order).toBeLessThan(execOrder);
    }
    expect(execOrder).toBeLessThan(readOrder);

    expect(onProgress).toHaveBeenCalledWith(100);
  });

  it("propagates a real ffmpeg failure without swallowing it", async () => {
    fakeFfmpeg.exec.mockRejectedValueOnce(new Error("exec boom"));

    await expect(
      burnMp4({
        videoFile: fakeVideoFile(),
        ass: "dummy ass",
        dims: { w: 1280, h: 720 },
        duration: 0.25,
      })
    ).rejects.toThrow("exec boom");

    // Progress listener still detached even on failure.
    expect(fakeFfmpeg.off).toHaveBeenCalledWith("progress", expect.any(Function));
  });
});
