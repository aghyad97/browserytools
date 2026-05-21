/**
 * Local helper around Segment Anything (SAM) running fully in-browser via
 * Transformers.js (@huggingface/transformers). Mirrors the loading pattern in
 * src/lib/hf-pipeline.ts:
 *
 * - The transformers module is loaded via dynamic import so onnxruntime-web
 *   stays out of the main bundle and only loads when the tool is used.
 * - The model + processor are fetched from the HF Hub CDN on first use and
 *   cached on-device by the browser. The image never leaves the device.
 * - WebGPU is used when available (Chrome/Edge), with an automatic WASM fallback.
 *
 * SAM needs lower-level APIs than `pipeline`, so we import { SamModel,
 * AutoProcessor, RawImage } directly. This module is mocked in tests so no real
 * model is downloaded.
 */
import type { LoadProgress } from "@/lib/hf-pipeline";
import { hasWebGPU } from "@/lib/hf-pipeline";

export type { LoadProgress };

export const SAM_MODEL = "Xenova/slimsam-77-uniform";

type TransformersModule = typeof import("@huggingface/transformers");
type SamModelInstance = Awaited<
  ReturnType<TransformersModule["SamModel"]["from_pretrained"]>
>;
type SamProcessorInstance = Awaited<
  ReturnType<TransformersModule["AutoProcessor"]["from_pretrained"]>
>;

let modulePromise: Promise<TransformersModule> | null = null;
let loadPromise: Promise<{
  model: SamModelInstance;
  processor: SamProcessorInstance;
}> | null = null;

async function getTransformers(): Promise<TransformersModule> {
  if (!modulePromise) {
    modulePromise = import("@huggingface/transformers").then((mod) => {
      mod.env.allowLocalModels = false;
      return mod;
    });
  }
  return modulePromise;
}

/** A point clicked on the image, in original image pixel coordinates. */
export type SamPoint = {
  x: number;
  y: number;
  /** 1 = include (foreground), 0 = exclude (background). */
  label: 0 | 1;
};

/** A binary mask the size of the original image (1 = object pixel). */
export type SamMask = {
  data: Uint8Array;
  width: number;
  height: number;
};

/**
 * Load (or reuse) the SAM model + processor. Reports aggregate download
 * progress via `onProgress`.
 */
export async function loadSam(
  onProgress?: (p: LoadProgress) => void
): Promise<{ model: SamModelInstance; processor: SamProcessorInstance }> {
  if (!loadPromise) {
    loadPromise = (async () => {
      const { SamModel, AutoProcessor } = await getTransformers();
      const device = hasWebGPU() ? "webgpu" : "wasm";

      const fileProgress: Record<string, number> = {};
      const progress_callback = (info: {
        status: string;
        file?: string;
        progress?: number;
      }) => {
        if (!onProgress) return;
        if (info.status === "progress" && info.file) {
          fileProgress[info.file] = info.progress ?? 0;
          const vals = Object.values(fileProgress);
          const percent = vals.length
            ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
            : 0;
          onProgress({ percent, status: "progress", file: info.file });
        } else if (info.status === "ready") {
          onProgress({ percent: 100, status: "ready" });
        } else {
          onProgress({ percent: 0, status: info.status });
        }
      };

      const model = await SamModel.from_pretrained(SAM_MODEL, {
        dtype: "fp16",
        device: device as "webgpu" | "wasm",
        progress_callback,
      });
      const processor = await AutoProcessor.from_pretrained(SAM_MODEL, {
        progress_callback,
      });
      return { model, processor };
    })();
  }
  return loadPromise;
}

/**
 * Run SAM for a set of click points on an image data URL and return the best
 * binary mask at the original image resolution.
 */
export async function segment(
  imageUrl: string,
  points: SamPoint[],
  onProgress?: (p: LoadProgress) => void
): Promise<SamMask> {
  const { RawImage } = await getTransformers();
  const { model, processor } = await loadSam(onProgress);

  const rawImage = await RawImage.read(imageUrl);

  // SAM's processor exposes lower-level methods (post_process_masks) not present
  // on the generic Processor type, so we access it through a loose alias.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const samProcessor = processor as any;

  // SAM expects 4D points [batch, point_batch, nb_points, 2] and 3D labels.
  const input_points = [points.map((p) => [p.x, p.y])];
  const input_labels = [points.map((p) => p.label)];

  const inputs = await samProcessor(rawImage, {
    input_points: [input_points],
    input_labels: [input_labels],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outputs = (await model(inputs)) as any;

  const masks = await samProcessor.post_process_masks(
    outputs.pred_masks,
    inputs.original_sizes,
    inputs.reshaped_input_sizes
  );

  // masks[0] has dims [1, num_masks, H, W]. Pick the mask with the highest
  // IoU score, then flatten to a single binary channel at original resolution.
  const maskTensor = masks[0];
  const [, numMasks, height, width] = maskTensor.dims as number[];
  const scores = Array.from(outputs.iou_scores.data as Float32Array);
  let best = 0;
  for (let i = 1; i < numMasks; i++) {
    if (scores[i] > scores[best]) best = i;
  }

  const flat = maskTensor.data as Uint8Array | Float32Array;
  const planeSize = width * height;
  const offset = best * planeSize;
  const out = new Uint8Array(planeSize);
  for (let i = 0; i < planeSize; i++) {
    out[i] = flat[offset + i] ? 1 : 0;
  }

  return { data: out, width, height };
}
