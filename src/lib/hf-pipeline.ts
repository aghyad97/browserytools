/**
 * Shared loader for in-browser Hugging Face models via Transformers.js
 * (@huggingface/transformers). Used by all on-device AI tools (transcribe,
 * summarize, translate, caption, upscale, segment, depth, sentiment, NER,
 * zero-shot, etc.).
 *
 * Design notes / hard-won lessons:
 * - Loaded via dynamic import so the (large) onnxruntime-web code stays out of
 *   the main bundle and only loads when an AI tool is actually used.
 * - Models are fetched from the HF CDN on first use and cached on-device by the
 *   browser; nothing is uploaded — on-brand for BrowseryTools' privacy promise.
 * - Pipelines are cached per task+model so repeated calls don't re-load.
 * - WebGPU is used when available with an automatic fallback to WASM.
 */
import type {
  PipelineType,
  ProgressInfo,
  ProgressCallback,
} from "@huggingface/transformers";

type TransformersModule = typeof import("@huggingface/transformers");

let modulePromise: Promise<TransformersModule> | null = null;

async function getTransformers(): Promise<TransformersModule> {
  if (!modulePromise) {
    modulePromise = import("@huggingface/transformers").then((mod) => {
      // Always fetch models from the HF Hub CDN (no local /models dir).
      mod.env.allowLocalModels = false;
      return mod;
    });
  }
  return modulePromise;
}

/** True if the browser exposes WebGPU (Chrome/Edge, recent Safari). */
export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

export type LoadProgress = {
  /** 0-100 overall download progress across the model's files. */
  percent: number;
  status: string;
  file?: string;
};

const pipelineCache = new Map<string, Promise<unknown>>();

export type GetPipelineOptions = {
  /** "webgpu" | "wasm". Defaults to WebGPU when available, else WASM. */
  device?: "webgpu" | "wasm" | "auto";
  /** Quantization dtype, e.g. "q8", "fp16", "fp32". */
  dtype?: string;
  onProgress?: (p: LoadProgress) => void;
};

/**
 * Get (or lazily create + cache) a Transformers.js pipeline for a task+model.
 * Reports aggregate download progress via `onProgress`.
 */
export async function getPipeline<T = unknown>(
  task: PipelineType,
  model: string,
  options: GetPipelineOptions = {}
): Promise<T> {
  const device =
    !options.device || options.device === "auto"
      ? hasWebGPU()
        ? "webgpu"
        : "wasm"
      : options.device;
  const key = `${task}::${model}::${device}::${options.dtype ?? ""}`;

  if (!pipelineCache.has(key)) {
    const promise = (async () => {
      const { pipeline } = await getTransformers();
      // Track per-file download progress and surface a single percentage.
      const fileProgress: Record<string, number> = {};
      const progress_callback: ProgressCallback = (info: ProgressInfo) => {
        if (!options.onProgress) return;
        if (info.status === "progress" && "file" in info) {
          fileProgress[info.file] = info.progress ?? 0;
          const vals = Object.values(fileProgress);
          const percent = vals.length
            ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
            : 0;
          options.onProgress({ percent, status: "progress", file: info.file });
        } else if (info.status === "ready") {
          options.onProgress({ percent: 100, status: "ready" });
        } else {
          options.onProgress({ percent: 0, status: info.status });
        }
      };

      return pipeline(task, model, {
        device: device as "webgpu" | "wasm",
        ...(options.dtype ? { dtype: options.dtype as never } : {}),
        progress_callback,
      });
    })();
    pipelineCache.set(key, promise);
  }

  return pipelineCache.get(key) as Promise<T>;
}
