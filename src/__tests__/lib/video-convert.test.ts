import { describe, it, expect } from "vitest";
import {
  buildConvertArgs,
  computeProgressStats,
  fileExtension,
  formatEta,
  formatSpeed,
  isValidTrimRange,
  outputFilename,
  parseDurationLine,
  parseProgressTime,
  targetDuration,
  type ConvertOptions,
} from "@/lib/media/video-convert";

const base: ConvertOptions = {
  format: "mp4",
  quality: "medium",
  resolution: "original",
  audio: "keep",
  audioBitrate: "192k",
  trimStart: null,
  trimEnd: null,
};

function args(overrides: Partial<ConvertOptions> = {}) {
  return buildConvertArgs("input.mov", "output.x", { ...base, ...overrides });
}

function valueAfter(list: string[], flag: string, nth = 0): string | undefined {
  let seen = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] === flag) {
      if (seen === nth) return list[i + 1];
      seen++;
    }
  }
  return undefined;
}

describe("buildConvertArgs", () => {
  it("encodes MP4 as H.264 + AAC with faststart", () => {
    const a = args({ format: "mp4" });
    expect(a[0]).toBe("-y");
    expect(valueAfter(a, "-c:v")).toBe("libx264");
    expect(valueAfter(a, "-crf")).toBe("23");
    expect(valueAfter(a, "-c:a")).toBe("aac");
    expect(valueAfter(a, "-b:a")).toBe("128k"); // keep → default bitrate
    expect(a).toContain("-movflags");
    expect(a[a.length - 1]).toBe("output.x");
  });

  it("encodes WebM as VP9 + Opus in constant-quality mode", () => {
    const a = args({ format: "webm", quality: "high" });
    expect(valueAfter(a, "-c:v")).toBe("libvpx-vp9");
    expect(valueAfter(a, "-crf")).toBe("24");
    expect(valueAfter(a, "-b:v")).toBe("0");
    expect(valueAfter(a, "-c:a")).toBe("libopus");
    expect(a).not.toContain("-movflags");
  });

  it("encodes AVI as MPEG-4 (xvid tag) + MP3 with -q:v quality", () => {
    const a = args({ format: "avi", quality: "low" });
    expect(valueAfter(a, "-c:v")).toBe("mpeg4");
    expect(valueAfter(a, "-vtag")).toBe("xvid");
    expect(valueAfter(a, "-q:v")).toBe("9");
    expect(valueAfter(a, "-c:a")).toBe("libmp3lame");
  });

  it("uses x264 for MKV and MOV, faststart only for MOV", () => {
    expect(valueAfter(args({ format: "mkv" }), "-c:v")).toBe("libx264");
    expect(args({ format: "mkv" })).not.toContain("-movflags");
    expect(valueAfter(args({ format: "mov" }), "-c:v")).toBe("libx264");
    expect(args({ format: "mov" })).toContain("-movflags");
  });

  it("builds a palette pipeline for GIF, always silent, looping", () => {
    const a = args({ format: "gif", quality: "medium", resolution: "480p" });
    const vf = valueAfter(a, "-vf") ?? "";
    expect(vf).toMatch(/^fps=12,scale=-2:480:flags=lanczos,split/);
    expect(vf).toContain("palettegen=max_colors=128");
    expect(vf).toContain("paletteuse");
    expect(a).toContain("-an");
    expect(a).not.toContain("-c:a");
    expect(valueAfter(a, "-loop")).toBe("0");
    // Audio mode is irrelevant for GIF — still silent.
    expect(args({ format: "gif", audio: "bitrate" })).toContain("-an");
  });

  it("maps the quality preset onto x264 CRF", () => {
    expect(valueAfter(args({ quality: "high" }), "-crf")).toBe("18");
    expect(valueAfter(args({ quality: "medium" }), "-crf")).toBe("23");
    expect(valueAfter(args({ quality: "low" }), "-crf")).toBe("28");
  });

  it("adds an even-width scale filter for a target resolution", () => {
    expect(args({ resolution: "original" })).not.toContain("-vf");
    expect(valueAfter(args({ resolution: "1080p" }), "-vf")).toBe("scale=-2:1080");
    expect(valueAfter(args({ resolution: "720p" }), "-vf")).toBe("scale=-2:720");
    expect(valueAfter(args({ resolution: "480p" }), "-vf")).toBe("scale=-2:480");
  });

  it("honours the audio modes", () => {
    const strip = args({ audio: "strip" });
    expect(strip).toContain("-an");
    expect(strip).not.toContain("-c:a");

    const custom = args({ audio: "bitrate", audioBitrate: "320k" });
    expect(valueAfter(custom, "-b:a")).toBe("320k");
  });

  it("applies trim as an input seek plus an output duration", () => {
    const both = args({ trimStart: 10, trimEnd: 70 });
    const ss = both.indexOf("-ss");
    const i = both.indexOf("-i");
    expect(ss).toBeGreaterThan(-1);
    expect(ss).toBeLessThan(i); // input option → fast seek
    expect(both[ss + 1]).toBe("10");
    expect(both.indexOf("-t")).toBeGreaterThan(i); // output option
    expect(valueAfter(both, "-t")).toBe("60");

    const onlyEnd = args({ trimEnd: 45 });
    expect(onlyEnd).not.toContain("-ss");
    expect(valueAfter(onlyEnd, "-t")).toBe("45");

    const onlyStart = args({ trimStart: 5 });
    expect(valueAfter(onlyStart, "-ss")).toBe("5");
    expect(onlyStart).not.toContain("-t");
  });
});

describe("isValidTrimRange", () => {
  it("accepts empty, single-sided and ordered ranges", () => {
    expect(isValidTrimRange(null, null)).toBe(true);
    expect(isValidTrimRange(5, null)).toBe(true);
    expect(isValidTrimRange(null, 5)).toBe(true);
    expect(isValidTrimRange(1, 5)).toBe(true);
  });
  it("rejects reversed, equal, negative or zero-length ranges", () => {
    expect(isValidTrimRange(5, 5)).toBe(false);
    expect(isValidTrimRange(9, 5)).toBe(false);
    expect(isValidTrimRange(-1, 5)).toBe(false);
    expect(isValidTrimRange(null, 0)).toBe(false);
  });
});

describe("names", () => {
  it("swaps the extension for the target format", () => {
    expect(outputFilename("holiday.MOV", "mp4")).toBe("holiday.mp4");
    expect(outputFilename("clip", "gif")).toBe("clip.gif");
    expect(outputFilename("a.b.c.mkv", "webm")).toBe("a.b.c.webm");
  });
  it("extracts a lower-cased extension", () => {
    expect(fileExtension("Movie.MKV")).toBe("mkv");
    expect(fileExtension("noext")).toBe("bin");
    expect(fileExtension("trailing.")).toBe("bin");
  });
});

describe("ffmpeg log parsing", () => {
  it("reads the source duration from the input banner", () => {
    expect(parseDurationLine("  Duration: 00:01:23.45, start: 0.000000, bitrate: 1200 kb/s")).toBeCloseTo(83.45);
    expect(parseDurationLine("  Duration: 01:00:00.00, bitrate: N/A")).toBe(3600);
    expect(parseDurationLine("Stream #0:0: Video: h264")).toBeNull();
  });
  it("reads the encoded position from a stats line", () => {
    expect(parseProgressTime("frame=  120 fps= 24 q=28.0 size=     512kB time=00:00:05.00 bitrate= 838.9kbits/s speed=0.5x")).toBe(5);
    expect(parseProgressTime("frame=1 time=00:02:03.50 speed=1x")).toBeCloseTo(123.5);
    expect(parseProgressTime("time=N/A")).toBeNull();
    // A duration banner must not be misread as progress.
    expect(parseProgressTime("  Duration: 00:01:23.45, start: 0")).toBeNull();
  });
});

describe("targetDuration", () => {
  it("prefers the trim window, falls back to source minus start", () => {
    expect(targetDuration(null, 10, 70)).toBe(60);
    expect(targetDuration(100, null, 30)).toBe(30);
    expect(targetDuration(100, 10, null)).toBe(90);
    expect(targetDuration(100, null, null)).toBe(100);
    expect(targetDuration(null, 10, null)).toBeNull();
  });
});

describe("computeProgressStats", () => {
  it("derives percent, speed and ETA when the target is known", () => {
    const s = computeProgressStats({
      processedSec: 30,
      elapsedSec: 15,
      targetSec: 120,
      fallbackRatio: 0,
    });
    expect(s.percent).toBe(25);
    expect(s.speed).toBe(2);
    expect(s.etaSec).toBe(45);
  });
  it("uses ffmpeg's ratio when the target is unknown and never reports 100", () => {
    const s = computeProgressStats({
      processedSec: 30,
      elapsedSec: 15,
      targetSec: null,
      fallbackRatio: 1,
    });
    expect(s.percent).toBe(99);
    expect(s.speed).toBe(2);
    expect(s.etaSec).toBeNull();
  });
  it("withholds speed until there is enough signal", () => {
    const s = computeProgressStats({
      processedSec: 0,
      elapsedSec: 0.2,
      targetSec: 10,
      fallbackRatio: 0,
    });
    expect(s.speed).toBeNull();
    expect(s.etaSec).toBeNull();
    expect(s.percent).toBe(0);
  });
});

describe("formatting", () => {
  it("formats speed with one decimal", () => {
    expect(formatSpeed(0.48)).toBe("0.5×");
    expect(formatSpeed(12.3)).toBe("12×");
  });
  it("formats an ETA coarsely", () => {
    expect(formatEta(42)).toBe("42s");
    expect(formatEta(125)).toBe("2m 05s");
    expect(formatEta(3780)).toBe("1h 03m");
    expect(formatEta(-3)).toBe("0s");
  });
});
