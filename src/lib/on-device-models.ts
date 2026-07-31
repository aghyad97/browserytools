/**
 * Real download sizes for the in-browser Transformers.js / ONNX models used
 * by BrowseryTools' on-device AI tools (Task 6.3 — model size disclosure).
 *
 * These tools silently pull tens to hundreds of MB on first use; on mobile
 * data that's a bounce and a real cost. This registry lets the UI show the
 * size BEFORE the download starts (src/lib/hf-pipeline.ts already exposes a
 * progress_callback for showing it DURING the download — see LoadProgress).
 *
 * Every byte count below was read directly from the HuggingFace Hub API:
 *   https://huggingface.co/api/models/<repo>?blobs=true
 * (each entry's `source` field is the exact URL used). NEVER replace a real
 * count with a guess — mark it `TODO(verify)` instead (none needed here; all
 * ten models resolved cleanly).
 *
 * Why webgpu/wasm can differ for the SAME model: when a component doesn't
 * pin a `dtype`, @huggingface/transformers resolves one from the device (see
 * node_modules/@huggingface/transformers/src/utils/dtypes.js,
 * DEFAULT_DEVICE_DTYPE_MAPPING) — "fp32" (full weights) on WebGPU, "q8"
 * (quantized, much smaller) on WASM. So the exact same tool can download a
 * very different number of bytes depending on whether the visitor's browser
 * has WebGPU. Components that instead pin `dtype` explicitly (Translator:
 * "q8", SAM: "fp16") or pin `device: "wasm"` always fetch the same files
 * regardless of the visitor's hardware — those entries carry `forceDevice`
 * and their webgpu/wasm arrays are identical on purpose.
 */
import { hasWebGPU } from "@/lib/hf-pipeline";

export type OnDeviceDevice = "webgpu" | "wasm";

export interface ModelSessionFile {
  /** transformers.js session name (e.g. "encoder_model") — provenance only. */
  session: string;
  /** Real file size in bytes, from the HF Hub blobs API. */
  bytes: number;
}

export interface OnDeviceModelEntry {
  /** HuggingFace repo id. */
  repo: string;
  /** Files fetched when the resolved device is WebGPU. */
  webgpu: ModelSessionFile[];
  /** Files fetched when the resolved device is WASM. */
  wasm: ModelSessionFile[];
  /**
   * Set when the calling component pins `device` (not "auto") or pins a
   * `dtype` that makes the file set device-independent — the size shown to
   * the user should not depend on WebGPU detection in that case.
   */
  forceDevice?: OnDeviceDevice;
  /** HF Hub API URL these byte counts were read from (2026-07-31). */
  source: string;
}

export type OnDeviceModelKey =
  | "whisper-base"
  | "swin2sr-x2"
  | "bert-base-ner"
  | "m2m100-418m"
  | "vit-gpt2-captioning"
  | "depth-anything-v2-small"
  | "nli-deberta-v3-xsmall"
  | "distilbart-cnn-6-6"
  | "distilbert-sst2"
  | "slimsam-77-uniform";

export const ON_DEVICE_MODELS: Record<OnDeviceModelKey, OnDeviceModelEntry> = {
  // AudioTranscriber + subtitle-studio/TranscribePanel — device: "auto".
  "whisper-base": {
    repo: "Xenova/whisper-base",
    webgpu: [
      { session: "encoder_model", bytes: 82_474_863 },
      { session: "decoder_model_merged", bytes: 208_560_983 },
    ],
    wasm: [
      { session: "encoder_model", bytes: 23_200_850 },
      { session: "decoder_model_merged", bytes: 53_707_539 },
    ],
    source: "https://huggingface.co/api/models/Xenova/whisper-base?blobs=true",
  },
  // ImageUpscaler — device: "auto".
  "swin2sr-x2": {
    repo: "Xenova/swin2SR-classical-sr-x2-64",
    webgpu: [{ session: "model", bytes: 54_428_699 }],
    wasm: [{ session: "model", bytes: 21_471_413 }],
    source:
      "https://huggingface.co/api/models/Xenova/swin2SR-classical-sr-x2-64?blobs=true",
  },
  // PiiRedactor — device: "wasm" (pinned).
  "bert-base-ner": {
    repo: "Xenova/bert-base-NER",
    webgpu: [{ session: "model", bytes: 108_952_255 }],
    wasm: [{ session: "model", bytes: 108_952_255 }],
    forceDevice: "wasm",
    source: "https://huggingface.co/api/models/Xenova/bert-base-NER?blobs=true",
  },
  // Translator — dtype: "q8" (pinned), so device doesn't change the download.
  "m2m100-418m": {
    repo: "Xenova/m2m100_418M",
    webgpu: [
      { session: "encoder_model", bytes: 287_856_370 },
      { session: "decoder_model_merged", bytes: 344_128_178 },
    ],
    wasm: [
      { session: "encoder_model", bytes: 287_856_370 },
      { session: "decoder_model_merged", bytes: 344_128_178 },
    ],
    forceDevice: "wasm",
    source: "https://huggingface.co/api/models/Xenova/m2m100_418M?blobs=true",
  },
  // ImageCaptioner — device: "auto".
  "vit-gpt2-captioning": {
    repo: "Xenova/vit-gpt2-image-captioning",
    webgpu: [
      { session: "encoder_model", bytes: 343_440_631 },
      { session: "decoder_model_merged", bytes: 615_025_088 },
    ],
    wasm: [
      { session: "encoder_model", bytes: 87_453_213 },
      { session: "decoder_model_merged", bytes: 158_599_996 },
    ],
    source:
      "https://huggingface.co/api/models/Xenova/vit-gpt2-image-captioning?blobs=true",
  },
  // DepthMap — device: "auto".
  "depth-anything-v2-small": {
    repo: "onnx-community/depth-anything-v2-small",
    webgpu: [{ session: "model", bytes: 99_060_839 }],
    wasm: [{ session: "model", bytes: 27_258_801 }],
    source:
      "https://huggingface.co/api/models/onnx-community/depth-anything-v2-small?blobs=true",
  },
  // ZeroShotClassifier — device: "wasm" (pinned).
  "nli-deberta-v3-xsmall": {
    repo: "Xenova/nli-deberta-v3-xsmall",
    webgpu: [{ session: "model", bytes: 87_246_587 }],
    wasm: [{ session: "model", bytes: 87_246_587 }],
    forceDevice: "wasm",
    source:
      "https://huggingface.co/api/models/Xenova/nli-deberta-v3-xsmall?blobs=true",
  },
  // TextSummarizer — device: "wasm" (pinned).
  "distilbart-cnn-6-6": {
    repo: "Xenova/distilbart-cnn-6-6",
    webgpu: [
      { session: "encoder_model", bytes: 128_819_737 },
      { session: "decoder_model_merged", bytes: 155_102_167 },
    ],
    wasm: [
      { session: "encoder_model", bytes: 128_819_737 },
      { session: "decoder_model_merged", bytes: 155_102_167 },
    ],
    forceDevice: "wasm",
    source:
      "https://huggingface.co/api/models/Xenova/distilbart-cnn-6-6?blobs=true",
  },
  // SentimentAnalyzer — device: "wasm" (pinned).
  "distilbert-sst2": {
    repo: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    webgpu: [{ session: "model", bytes: 67_581_197 }],
    wasm: [{ session: "model", bytes: 67_581_197 }],
    forceDevice: "wasm",
    source:
      "https://huggingface.co/api/models/Xenova/distilbert-base-uncased-finetuned-sst-2-english?blobs=true",
  },
  // ObjectCutout (src/lib/sam-segment.ts) — dtype: "fp16" (pinned).
  "slimsam-77-uniform": {
    repo: "Xenova/slimsam-77-uniform",
    webgpu: [
      { session: "vision_encoder", bytes: 12_170_657 },
      { session: "prompt_encoder_mask_decoder", bytes: 8_550_118 },
    ],
    wasm: [
      { session: "vision_encoder", bytes: 12_170_657 },
      { session: "prompt_encoder_mask_decoder", bytes: 8_550_118 },
    ],
    forceDevice: "wasm",
    source: "https://huggingface.co/api/models/Xenova/slimsam-77-uniform?blobs=true",
  },
};

/** Total bytes for a model+device combination — pure, no browser detection. */
export function totalBytesFor(key: OnDeviceModelKey, device: OnDeviceDevice): number {
  const entry = ON_DEVICE_MODELS[key];
  const files = device === "webgpu" ? entry.webgpu : entry.wasm;
  return files.reduce((sum, f) => sum + f.bytes, 0);
}

/**
 * Best estimate of what THIS visitor's browser will actually download for
 * `key` — detects WebGPU client-side (matching the exact device-resolution
 * hf-pipeline.ts / sam-segment.ts use) unless the entry pins a device.
 */
export function estimatedDownloadBytes(key: OnDeviceModelKey): number {
  const entry = ON_DEVICE_MODELS[key];
  const device: OnDeviceDevice = entry.forceDevice ?? (hasWebGPU() ? "webgpu" : "wasm");
  return totalBytesFor(key, device);
}
