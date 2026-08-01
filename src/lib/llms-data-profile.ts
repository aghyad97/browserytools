// ──────────────────────────────────────────────────────────────────────────────
// Network data-profile registry for the /llms.txt and /llms-full.txt surfaces.
//
// The homepage/marketing copy says tools are "client-side" as a category, but
// that is not a uniform claim across all 152 tools: a subset downloads AI model
// weights from a third-party CDN on first use, and two tools genuinely send
// data over the network for their core function. This module is the single
// source of truth those two route handlers pull from so the privacy claim in
// generated output is qualified per tool instead of asserted once for everyone.
//
// Every entry here is backed by the tool's own implementation or its authored
// UI copy (see the comments beside each group) — nothing is guessed:
//   - "model-download" tools call `getPipeline()` (src/lib/hf-pipeline.ts,
//     Transformers.js/Xenova), use the SAM segmenter (src/lib/sam-segment.ts),
//     the imgly background-removal WASM+model bundle, or Tesseract.js — every
//     one of these already ships an honest "downloads a model from a CDN"
//     modelNote/privacyNote string in messages/en.json, quoted below.
//   - "remote-processing" (speech-to-text): the component calls the browser's
//     native `SpeechRecognition`/`webkitSpeechRecognition` API. In Chromium
//     browsers that implementation sends the captured audio to the browser
//     vendor's speech service — it is not on-device recognition.
//   - "remote-data" (currency-converter): fetches exchange rates from
//     api.frankfurter.app (falling back to exchangerate-api.com). No user
//     content is sent — only the request for rates — but it is a live network
//     dependency the tool cannot function without.
// Every slug not listed here defaults to "on-device": the user's file/text
// content is processed locally and never transmitted.
//
// Kept as its own module rather than added to tools-config.ts because that
// file is parsed by scripts/validate-tools.js with a regex whose `items`
// capture stops at the first `]`; an extra field on a tool entry there would
// silently truncate the parse (see src/lib/tool-clusters.ts for the same
// constraint applied to cluster membership).
// ──────────────────────────────────────────────────────────────────────────────

export type ToolDataProfile =
  | "on-device"
  | "model-download"
  | "remote-processing"
  | "remote-data";

export interface NetworkNote {
  profile: ToolDataProfile;
  /** One or two sentences, honest and specific, safe to quote verbatim. */
  note: string;
}

// Slug = the segment after /tools/.
export const NETWORK_NOTES: Record<string, NetworkNote> = {
  // ── Transformers.js / Xenova models — src/lib/hf-pipeline.ts ─────────────
  "audio-transcriber": {
    profile: "model-download",
    note: "Runs OpenAI Whisper entirely in your browser via WebGPU (with a WASM fallback). The model downloads once from a CDN on first use, then transcribes on-device — your audio is never uploaded.",
  },
  "subtitle-studio": {
    profile: "model-download",
    note: "Runs OpenAI Whisper entirely in your browser via WebGPU (with a WASM fallback). The model downloads once from a CDN on first use, then transcribes on-device — your video is never uploaded.",
  },
  "text-to-speech": {
    profile: "model-download",
    note: "AI voices run in your browser. The selected voice downloads a model (roughly 20-60MB) from a CDN the first time you use it, then plays and exports entirely on your device.",
  },
  "sentiment-analyzer": {
    profile: "model-download",
    note: "Runs a small AI model entirely in your browser. The model downloads once from a CDN on first use, then analyzes text on-device — nothing is uploaded.",
  },
  "text-summarizer": {
    profile: "model-download",
    note: "Runs a small AI summarization model entirely in your browser. The model downloads once from a CDN on first use, then summarizes text on-device — nothing is uploaded.",
  },
  translator: {
    profile: "model-download",
    note: "Runs an AI translation model entirely in your browser. The model (a few hundred MB) downloads once from a CDN on first use, then translates on-device — nothing is sent to Google, DeepL, or any server.",
  },
  "image-captioner": {
    profile: "model-download",
    note: "Runs a small image-to-text AI model entirely in your browser. The model downloads once from a CDN on first use, then generates captions on-device — your image is never uploaded.",
  },
  "pii-redactor": {
    profile: "model-download",
    note: "Runs a small AI named-entity-recognition model entirely in your browser, plus pattern matching for emails, phone numbers, credit cards, and IPs. The model downloads once from a CDN on first use, then runs on-device — your text is never uploaded.",
  },
  "depth-map": {
    profile: "model-download",
    note: "Runs a small AI depth-estimation model entirely in your browser. The model downloads once from a CDN on first use, then estimates depth on-device with WebGPU when available — nothing is uploaded.",
  },
  "zero-shot-classifier": {
    profile: "model-download",
    note: "Runs a small zero-shot AI model entirely in your browser. The model downloads once from a CDN on first use, then classifies text on-device against your labels — nothing is uploaded.",
  },
  "image-upscaler": {
    profile: "model-download",
    note: "Runs a super-resolution AI model entirely in your browser. The model downloads once from a CDN on first use, then upscales on-device — your image is never uploaded.",
  },

  // ── Other in-browser models ───────────────────────────────────────────────
  "object-cutout": {
    profile: "model-download",
    note: "Runs the Segment Anything (SAM) model entirely in your browser. The model downloads once from a CDN on first use, then runs on-device — your image is never uploaded.",
  },
  "bg-removal": {
    profile: "model-download",
    note: "The AI background-removal model is downloaded once from a CDN and cached in your browser. Your images are processed entirely on your device and never leave it.",
  },
  "image-to-text": {
    profile: "model-download",
    note: "The OCR engine (Tesseract.js) runs entirely on your device. Its language data is downloaded once from the official tessdata CDN and cached — your image is never uploaded to any server.",
  },

  // ── Genuine network dependencies ──────────────────────────────────────────
  "speech-to-text": {
    profile: "remote-processing",
    note: "Uses the browser's native Web Speech API rather than an on-device model. In Chrome and Edge, that API sends your captured audio to the browser vendor's speech-recognition service to produce the transcript — it is not private, on-device recognition.",
  },
  "currency-converter": {
    profile: "remote-data",
    note: "Fetches live exchange rates from an external API (Frankfurter, with an ExchangeRate-API fallback) on load. No file or text content is sent — only the request for current rates.",
  },
};

/** Data profile for a tool slug; tools with no entry are plain on-device. */
export function dataProfileFor(slug: string): ToolDataProfile {
  return NETWORK_NOTES[slug]?.profile ?? "on-device";
}

/** True for any profile where something leaves the device for the tool to work. */
export function touchesNetwork(profile: ToolDataProfile): boolean {
  return profile !== "on-device";
}
