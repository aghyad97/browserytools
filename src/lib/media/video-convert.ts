/**
 * Pure helpers for the Video Converter tool — the ffmpeg argument builder,
 * the per-format codec table, and the progress/ETA maths. Kept free of React
 * and of the ffmpeg instance so every branch is unit-testable without WASM.
 *
 * Codec choices are pinned to what the shipped @ffmpeg/core build actually
 * links (see public/ffmpeg/ffmpeg-core.wasm configure line): libx264,
 * libvpx-vp9, libopus, libmp3lame, plus ffmpeg's native aac / mpeg4 / gif
 * encoders. No libx265 is used — single-threaded HEVC in wasm is far too slow.
 */

export type OutputFormat = "mp4" | "webm" | "mkv" | "avi" | "gif" | "mov";
export type Quality = "high" | "medium" | "low";
export type Resolution = "original" | "1080p" | "720p" | "480p";
export type AudioMode = "keep" | "bitrate" | "strip";

export const OUTPUT_FORMATS: readonly OutputFormat[] = [
  "mp4",
  "webm",
  "mkv",
  "avi",
  "gif",
  "mov",
];
export const QUALITIES: readonly Quality[] = ["high", "medium", "low"];
export const RESOLUTIONS: readonly Resolution[] = [
  "original",
  "1080p",
  "720p",
  "480p",
];
export const AUDIO_MODES: readonly AudioMode[] = ["keep", "bitrate", "strip"];
export const AUDIO_BITRATES = ["96k", "128k", "192k", "256k", "320k"] as const;
/** Bitrate used by the "keep" audio mode (re-encoded to the container's codec). */
export const DEFAULT_AUDIO_BITRATE = "128k";

/** Input extensions the dropzone accepts. */
export const INPUT_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".mkv",
  ".avi",
  ".webm",
  ".flv",
  ".wmv",
  ".m4v",
  ".ts",
] as const;

export interface FormatSpec {
  ext: OutputFormat;
  mime: string;
  /** Whether the container can carry an audio track (GIF cannot). */
  hasAudio: boolean;
  /** How the browser can show the result: a <video>, an <img>, or not at all. */
  preview: "video" | "image" | "none";
}

export const FORMAT_SPECS: Record<OutputFormat, FormatSpec> = {
  mp4: { ext: "mp4", mime: "video/mp4", hasAudio: true, preview: "video" },
  webm: { ext: "webm", mime: "video/webm", hasAudio: true, preview: "video" },
  mkv: { ext: "mkv", mime: "video/x-matroska", hasAudio: true, preview: "none" },
  avi: { ext: "avi", mime: "video/x-msvideo", hasAudio: true, preview: "none" },
  gif: { ext: "gif", mime: "image/gif", hasAudio: false, preview: "image" },
  mov: { ext: "mov", mime: "video/quicktime", hasAudio: true, preview: "video" },
};

const RESOLUTION_HEIGHT: Record<Exclude<Resolution, "original">, number> = {
  "1080p": 1080,
  "720p": 720,
  "480p": 480,
};

// Quality → encoder rate-control value. x264/VP9 use CRF (lower = better);
// mpeg4 uses -q:v (2..31, lower = better); GIF trades fps + palette size.
const X264_CRF: Record<Quality, number> = { high: 18, medium: 23, low: 28 };
const VP9_CRF: Record<Quality, number> = { high: 24, medium: 31, low: 38 };
const MPEG4_Q: Record<Quality, number> = { high: 2, medium: 5, low: 9 };
const GIF_FPS: Record<Quality, number> = { high: 15, medium: 12, low: 8 };
const GIF_COLORS: Record<Quality, number> = { high: 256, medium: 128, low: 64 };

export interface ConvertOptions {
  format: OutputFormat;
  quality: Quality;
  resolution: Resolution;
  audio: AudioMode;
  /** Used only when `audio === "bitrate"`. */
  audioBitrate: string;
  /** Seconds, or null when the trim field is empty. */
  trimStart: number | null;
  trimEnd: number | null;
}

/** `scale=-2:H` keeps the aspect ratio with an even width (x264 needs it). */
function scaleFilter(resolution: Resolution): string | null {
  if (resolution === "original") return null;
  return `scale=-2:${RESOLUTION_HEIGHT[resolution]}`;
}

function videoArgs(opts: ConvertOptions): string[] {
  const scale = scaleFilter(opts.resolution);
  switch (opts.format) {
    case "mp4":
    case "mkv":
    case "mov":
      return [
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        String(X264_CRF[opts.quality]),
        "-pix_fmt",
        "yuv420p",
        ...(scale ? ["-vf", scale] : []),
      ];
    case "webm":
      return [
        "-c:v",
        "libvpx-vp9",
        "-crf",
        String(VP9_CRF[opts.quality]),
        "-b:v",
        "0",
        "-deadline",
        "realtime",
        "-cpu-used",
        "8",
        ...(scale ? ["-vf", scale] : []),
      ];
    case "avi":
      return [
        "-c:v",
        "mpeg4",
        "-vtag",
        "xvid",
        "-q:v",
        String(MPEG4_Q[opts.quality]),
        ...(scale ? ["-vf", scale] : []),
      ];
    case "gif": {
      // Single-pass palette pipeline: split → palettegen → paletteuse gives
      // far better colour than ffmpeg's default 256-colour dither, in one exec
      // so progress events stay continuous.
      const chain = [
        `fps=${GIF_FPS[opts.quality]}`,
        ...(scale ? [`${scale}:flags=lanczos`] : []),
        "split[s0][s1]",
      ].join(",");
      const filter = `${chain};[s0]palettegen=max_colors=${GIF_COLORS[opts.quality]}[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5`;
      return ["-vf", filter, "-loop", "0"];
    }
  }
}

function audioArgs(opts: ConvertOptions): string[] {
  const spec = FORMAT_SPECS[opts.format];
  if (!spec.hasAudio || opts.audio === "strip") return ["-an"];
  const bitrate =
    opts.audio === "bitrate" ? opts.audioBitrate : DEFAULT_AUDIO_BITRATE;
  const codec =
    opts.format === "webm"
      ? "libopus"
      : opts.format === "avi"
        ? "libmp3lame"
        : "aac";
  return ["-c:a", codec, "-b:a", bitrate];
}

/**
 * Trim is applied as an INPUT seek (`-ss` before `-i`) so ffmpeg jumps to the
 * nearest keyframe instead of decoding everything before the start point —
 * frame-accurate since we always re-encode. The end is expressed as an
 * output `-t` duration relative to that seek.
 */
function trimArgs(opts: ConvertOptions): { input: string[]; output: string[] } {
  const start = opts.trimStart;
  const end = opts.trimEnd;
  const input = start !== null ? ["-ss", String(start)] : [];
  let output: string[] = [];
  if (end !== null) {
    const duration = start !== null ? end - start : end;
    output = ["-t", String(duration)];
  }
  return { input, output };
}

/** Full ffmpeg argv for one conversion. `-y` so a leftover output can't stall. */
export function buildConvertArgs(
  inputName: string,
  outputName: string,
  opts: ConvertOptions,
): string[] {
  const trim = trimArgs(opts);
  const container =
    opts.format === "mp4" || opts.format === "mov"
      ? ["-movflags", "+faststart"]
      : [];
  return [
    "-y",
    ...trim.input,
    "-i",
    inputName,
    ...trim.output,
    ...videoArgs(opts),
    ...audioArgs(opts),
    ...container,
    outputName,
  ];
}

/**
 * Validates a parsed trim pair. Returns true when the pair is usable:
 * both non-negative, and start strictly before end when both are set.
 */
export function isValidTrimRange(
  start: number | null,
  end: number | null,
): boolean {
  if (start !== null && start < 0) return false;
  if (end !== null && end <= 0) return false;
  if (start !== null && end !== null && start >= end) return false;
  return true;
}

/** Output filename: `clip.mov` + mp4 → `clip.mp4`. */
export function outputFilename(inputName: string, format: OutputFormat): string {
  const base = inputName.replace(/\.[^.]+$/, "") || "video";
  return `${base}.${FORMAT_SPECS[format].ext}`;
}

/** Lower-cased extension without the dot, "bin" when the name has none. */
export function fileExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx >= 0 && idx < name.length - 1
    ? name.slice(idx + 1).toLowerCase()
    : "bin";
}

// ── Progress ────────────────────────────────────────────────────────────────

const HMS = /(\d+):(\d{2}):(\d{2}(?:\.\d+)?)/;

function hmsToSeconds(m: RegExpMatchArray): number {
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** Source length from ffmpeg's stderr banner: `  Duration: 00:01:23.45, start: …`. */
export function parseDurationLine(message: string): number | null {
  const m = message.match(/Duration:\s*(\d+):(\d{2}):(\d{2}(?:\.\d+)?)/);
  return m ? hmsToSeconds(m) : null;
}

/** Encoded position from a stats line: `frame=  120 fps= 24 … time=00:00:05.00 …`. */
export function parseProgressTime(message: string): number | null {
  const m = message.match(/\btime=\s*(\d+):(\d{2}):(\d{2}(?:\.\d+)?)/);
  if (!m) return null;
  return hmsToSeconds(m as RegExpMatchArray);
}

/**
 * Expected output length in seconds given the source length (may be unknown)
 * and the trim window. Null when it can't be known yet.
 */
export function targetDuration(
  sourceDuration: number | null,
  trimStart: number | null,
  trimEnd: number | null,
): number | null {
  const start = trimStart ?? 0;
  if (trimEnd !== null) return Math.max(0, trimEnd - start);
  if (sourceDuration === null) return null;
  return Math.max(0, sourceDuration - start);
}

export interface ProgressStats {
  /** 0–100, never reaches 100 until the caller marks completion. */
  percent: number;
  /** Media seconds encoded per wall-clock second, or null before any data. */
  speed: number | null;
  /** Estimated seconds remaining, or null when unknowable. */
  etaSec: number | null;
}

export function computeProgressStats(input: {
  processedSec: number;
  elapsedSec: number;
  targetSec: number | null;
  /** ffmpeg.wasm's own 0..1 ratio — fallback when the target is unknown. */
  fallbackRatio: number;
}): ProgressStats {
  const { processedSec, elapsedSec, targetSec, fallbackRatio } = input;
  const speed =
    elapsedSec > 0.5 && processedSec > 0 ? processedSec / elapsedSec : null;

  let percent: number;
  if (targetSec !== null && targetSec > 0) {
    percent = (processedSec / targetSec) * 100;
  } else {
    percent = fallbackRatio * 100;
  }
  percent = Math.max(0, Math.min(99, Math.round(percent)));

  let etaSec: number | null = null;
  if (speed !== null && targetSec !== null && targetSec > 0) {
    etaSec = Math.max(0, (targetSec - processedSec) / speed);
  }
  return { percent, speed, etaSec };
}

/** "1.4×" — one decimal, LTR-safe. */
export function formatSpeed(speed: number): string {
  return `${speed.toFixed(speed >= 10 ? 0 : 1)}×`;
}

/** "45s", "2m 05s", "1h 03m" — coarse on purpose; an ETA is an estimate. */
export function formatEta(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}m`;
}
