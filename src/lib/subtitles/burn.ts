// MP4 burn-in pipeline: rasterizes the ASS caption track with JASSUB
// (headless — see ./rasterize.ts) and composites it onto the source video
// with stock ffmpeg's `overlay` filter.
//
// The handoff and ffmpeg args below are copied VERBATIM from the Task-1
// spike (docs/superpowers/specs/2026-07-18-wave-5-spike-findings.md):
//   1. rasterize the caption layer to a transparent PNG SEQUENCE
//      (cap%04d.png) — proven working; a transparent alpha *video* was
//      rejected because the self-hosted core can't mux the alpha codecs
//      that matter (prores4444/qtrle absent; webm-in-MEMFS overlay fragile);
//   2. write the sequence to ffmpeg's MEMFS alongside the raw source bytes
//      (gotcha #4: `fetchFile()` corrupts a `Uint8Array` we already hold —
//      write straight to `ffmpeg.writeFile` instead);
//   3. composite with `-framerate`/`-start_number` (INPUT options — must
//      precede the image-sequence `-i`) + `[0:v][1:v]overlay=0:0:format=auto`;
//   4. encode H.264/yuv420p video and copy the source AAC audio verbatim.
import { getFFmpeg } from "@/lib/media/ffmpeg";
import { rasterizeCaptionFrames } from "./rasterize";

/**
 * Envelope thresholds for the in-browser burn.
 *
 * The spike's "Hard memory ceiling" finding: the self-hosted ffmpeg core's
 * 2 GiB wasm MEMFS heap holds the full input MP4 + full output MP4 + every
 * caption PNG simultaneously, so long/high-res clips can OOM-abort the
 * encode. Its measured practical envelope is ~10 min @720p or ~3-5 min
 * @1080p before that risk becomes real, so:
 *   - `maxSeconds` is a hard ceiling at the 720p envelope's floor (10 min) —
 *     burnMp4 refuses to run at all past it, at any resolution.
 *   - `warnHeight` flags anything >=1080p on its own: that resolution's
 *     safe envelope (3-5 min) is well inside `maxSeconds`, so a duration
 *     that's "ok" at 720p can already be risky at 1080p.
 *   - `warnSeconds` (5 min) is a conservative buffer inside the 720p
 *     ceiling so users get a heads-up before they're minutes from the hard
 *     limit.
 */
export const EXPORT_LIMITS = {
  warnSeconds: 300,
  warnHeight: 1080,
  maxSeconds: 600,
} as const;

export type EnvelopeStatus = "ok" | "warn" | "blocked";

export function envelopeStatus(
  duration: number,
  height: number
): EnvelopeStatus {
  if (duration > EXPORT_LIMITS.maxSeconds) return "blocked";
  if (duration > EXPORT_LIMITS.warnSeconds || height >= EXPORT_LIMITS.warnHeight) {
    return "warn";
  }
  return "ok";
}

/** Thrown by burnMp4 when the clip is past the hard `maxSeconds` ceiling. */
export class BurnEnvelopeExceededError extends Error {
  constructor(duration: number) {
    super(
      `Clip is ${Math.round(duration)}s, past the ${EXPORT_LIMITS.maxSeconds}s in-browser burn-in ceiling.`
    );
    this.name = "BurnEnvelopeExceededError";
  }
}

// Caption-layer render rate, independent of the source video's fps.
// Subtitles change at word/line boundaries, not per video frame — the
// spike's production mitigation #1 found ~5-8fps cuts frame count 3-5x
// with no visible quality loss (overlay's framesync holds each caption
// frame until the next one arrives).
const CAPTION_FPS = 8;

export interface BurnMp4Options {
  videoFile: File;
  ass: string;
  dims: { w: number; h: number };
  duration: number;
  onProgress?: (p: number) => void;
}

/**
 * Rasterizes `ass` over the video and composites it in, returning a
 * playable MP4 Blob (H.264/yuv420p video, source AAC audio copied through).
 * Throws `BurnEnvelopeExceededError` up front if the clip is past
 * `EXPORT_LIMITS.maxSeconds` — no ffmpeg work is attempted.
 */
export async function burnMp4(opts: BurnMp4Options): Promise<Blob> {
  const { videoFile, ass, dims, duration, onProgress } = opts;

  if (envelopeStatus(duration, dims.h) === "blocked") {
    throw new BurnEnvelopeExceededError(duration);
  }

  const frames = await rasterizeCaptionFrames({
    ass,
    dims,
    duration,
    fps: CAPTION_FPS,
  });

  const ffmpeg = await getFFmpeg();
  const onFfmpegProgress = ({ progress: p }: { progress: number }) => {
    onProgress?.(Math.min(100, Math.max(0, Math.round(p * 100))));
  };
  ffmpeg.on("progress", onFfmpegProgress);

  const inputName = "input.mp4";
  const outputName = "output.mp4";
  const capNames: string[] = [];

  try {
    // Gotcha #4: fetchFile() mangled a Uint8Array in the spike ("moov atom
    // not found"). We already have a File, so read its bytes ourselves and
    // write them straight to MEMFS instead of routing through fetchFile.
    const videoBytes = new Uint8Array(await videoFile.arrayBuffer());
    await ffmpeg.writeFile(inputName, videoBytes);

    for (let i = 0; i < frames.length; i++) {
      const name = `cap${String(i).padStart(4, "0")}.png`;
      capNames.push(name);
      await ffmpeg.writeFile(name, frames[i]);
    }

    // Arg order copied verbatim from the spike findings: -framerate and
    // -start_number are INPUT options and must precede the image-sequence
    // -i, which itself must come after the video -i.
    const args = [
      "-i",
      inputName,
      "-framerate",
      String(CAPTION_FPS),
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
      outputName,
    ];

    await ffmpeg.exec(args);
    const data = (await ffmpeg.readFile(outputName)) as Uint8Array;
    onProgress?.(100);

    return new Blob([new Uint8Array(data).buffer as ArrayBuffer], {
      type: "video/mp4",
    });
  } finally {
    // Detach the per-run progress listener so repeat burns on the shared
    // singleton don't stack subscriptions (mirrors CompressVideo.tsx).
    ffmpeg.off("progress", onFfmpegProgress);
    // Best-effort MEMFS cleanup so repeat burns don't accumulate frames
    // and inputs across runs on the shared singleton.
    for (const name of [inputName, outputName, ...capNames]) {
      try {
        await ffmpeg.deleteFile(name);
      } catch {
        // Ignore — a file may be missing if an earlier step threw first.
      }
    }
  }
}
