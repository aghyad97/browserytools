/**
 * Target-size compression engine.
 *
 * Given a decoded image and a byte budget, finds the largest/highest-quality
 * lossy encoding that fits under the target. It binary-searches encoder quality
 * at the current dimensions, and — only when even the lowest quality overshoots
 * — steps the dimensions down and tries again. All encoding goes through an
 * injectable `encode` (defaults to `canvasToBlob`) so it is fully testable
 * without real canvas encoding.
 */

import { canvasToBlob, drawToCanvas } from "@/lib/image/canvas";

export type TargetSizeFormat = "image/jpeg" | "image/webp";

export interface TargetSizeRequest {
  source: HTMLImageElement | ImageBitmap;
  targetBytes: number;
  format: TargetSizeFormat;
  minWidth?: number; // dimension floor, default 160
  encode?: (canvas: HTMLCanvasElement, type: string, quality: number) => Promise<Blob | null>;
}

export interface TargetSizeResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number; // 0..1 quality actually used
  iterations: number; // total encode calls
  hitTarget: boolean; // false = best effort, target unreachable
}

const MIN_QUALITY = 0.3;
const MAX_QUALITY = 0.95;
const MAX_PROBES = 7;
const MAX_DIMENSION_PASSES = 3;
const EARLY_ACCEPT_RATIO = 0.9; // accept immediately inside [0.90*target, target]
const DEFAULT_MIN_WIDTH = 160;

interface Candidate {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
}

export async function compressToTargetSize(req: TargetSizeRequest): Promise<TargetSizeResult> {
  const { source, targetBytes, format } = req;
  const minWidth = req.minWidth ?? DEFAULT_MIN_WIDTH;
  const encode = req.encode ?? canvasToBlob;

  // Natural dimensions work for both HTMLImageElement (naturalWidth/Height) and
  // ImageBitmap (width/height); the `|| source.width` fallback covers both.
  const naturalWidth = (source as HTMLImageElement).naturalWidth || source.width;
  const naturalHeight = (source as HTMLImageElement).naturalHeight || source.height;
  const aspect = naturalHeight / naturalWidth;

  let width = naturalWidth;
  let height = naturalHeight;

  let iterations = 0;
  // Smallest probe seen anywhere, for the best-effort fallback.
  let smallest: Candidate | null = null;

  for (let pass = 0; pass < MAX_DIMENSION_PASSES; pass++) {
    width = Math.min(width, naturalWidth); // never upscale
    const canvas = drawToCanvas(source, width, height);

    let lo = MIN_QUALITY;
    let hi = MAX_QUALITY;
    let candidate: Candidate | null = null; // largest size <= target at these dims
    let anySuccess = false;
    let lowestSize = Number.POSITIVE_INFINITY; // smallest size produced this pass

    for (let probe = 0; probe < MAX_PROBES; probe++) {
      const quality = (lo + hi) / 2;
      const blob = await encode(canvas, format, quality);
      iterations++;

      if (!blob) {
        // No size information — re-probe without moving the window. If every
        // probe of this pass is null we throw below.
        continue;
      }
      anySuccess = true;

      if (blob.size < lowestSize) lowestSize = blob.size;
      if (!smallest || blob.size < smallest.blob.size) {
        smallest = { blob, width, height, quality };
      }

      if (blob.size > targetBytes) {
        hi = quality; // too big → drop to the lower half
      } else {
        if (!candidate || blob.size > candidate.blob.size) {
          candidate = { blob, width, height, quality };
        }
        // Close enough — near-optimal, stop early.
        if (blob.size >= EARLY_ACCEPT_RATIO * targetBytes) {
          return { ...candidate, iterations, hitTarget: true };
        }
        lo = quality; // room to spare → try higher quality
      }
    }

    if (!anySuccess) throw new Error("encode-failed");

    if (candidate) {
      // These are the largest available dimensions with a fit — done.
      return { ...candidate, iterations, hitTarget: true };
    }

    // Even the lowest quality overshoots: shrink dimensions and retry.
    const scale = Math.sqrt(targetBytes / lowestSize);
    let nextWidth = Math.round(width * scale);
    if (nextWidth < minWidth) nextWidth = minWidth;
    nextWidth = Math.min(nextWidth, naturalWidth);
    width = nextWidth;
    height = Math.max(1, Math.round(nextWidth * aspect));
  }

  // Exhausted every pass without ever fitting under target → best effort.
  if (!smallest) throw new Error("encode-failed");
  return { ...smallest, iterations, hitTarget: false };
}
