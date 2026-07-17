/**
 * Default ordering for the landing "Popular" grid (Everything / no filter).
 *
 * Tier 1 (ranks 1-13) — the site's own most-visited tools, in order, from
 * Vercel Analytics top-pages (owner-provided, 2026-07-13 screenshot).
 *
 * Tier 2 — remaining tools ranked by external search demand: directional
 * Google query volume for each tool's head terms ("merge pdf", "qr code
 * generator", "password generator", "word counter", ...). Volumes are
 * directional tiers, not exact counts; revisit when Search Console data
 * accumulates post-launch.
 *
 * Unlisted slugs fall back to locale-aware alphabetical after the ranked set
 * (see landing.tsx catalog sort).
 */
export const TOOL_POPULARITY: string[] = [
  // — Tier 1: site analytics (exact order from top-pages) —
  "depth-map",
  "pdf",
  "bg-removal",
  "audio-transcriber",
  "photo-censor",
  "phone-mockups",
  "image-resizer",
  "crop-image",
  "watermark-image",
  "image-captioner",
  "screenshot-beautifier",
  "image-compression",
  "compress-video",
  "meme-generator",
  "video",
  // — Tier 2: search-demand ranking (head-term volume, descending) —
  "qr-generator",        // "qr code generator" — one of the largest utility queries
  "password-generator",
  // PDF operations — each a large head-term query ("merge pdf", "jpg to pdf",
  // "compress pdf", …). Surfaced as their own cards (Tool.inGrid) and kept
  // contiguous here so they read as a cluster in the grid.
  "merge-pdf",
  "jpg-to-pdf",
  "compress-pdf",
  "split-pdf",
  "sign-pdf",
  "rotate-pdf",
  "watermark-pdf",
  "extract-text-from-pdf",
  "reorder-pdf-pages",
  "image-converter",     // heic→jpg / webp→png conversions
  "heic-to-jpg",
  "unit-converter",
  "text-counter",        // "word counter"
  "word-unscrambler",    // "word unscrambler" — strong search term
  "wordle-solver",       // "wordle solver" — strong search term
  "anagram-solver",      // "anagram solver" — strong search term
  "json-formatter",
  "currency-converter",
  "translator",
  "speech-to-text",
  "text-to-speech",
  "invoice",
  "age-calculator",
  "bmi-calculator",
  "loan-calculator",
  "percentage-calculator",
  "gif-maker",
  "screen-recorder",
  "base64",
  "markdown-editor",
  "audio",               // audio cutter/editor queries
  "favicon-generator",
  "svg-png",
  "color-converter",
  "color-palette",
  "css-gradient",
  "timer",
  "classroom-timer",
  "pomodoro",
  "stopwatch",
  "regex-tester",
  "hash-generator",
  "barcode-generator",
  "emoji-picker",
  "fake-data",
  "text-case",
  "text-diff",
  "keyboard-tester",
];

const RANK = new Map(TOOL_POPULARITY.map((slug, i) => [slug, i]));

/** Sort key: ranked tools first (analytics, then search demand), rest ∞. */
export function popularityRank(slug: string): number {
  return RANK.get(slug) ?? Number.POSITIVE_INFINITY;
}
