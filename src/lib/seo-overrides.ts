// Per-slug overrides for the English <title> and meta description built by
// src/lib/metadata.ts. Only for pages where Search Console shows the templated
// "<Name> - Free Browser Tool" title is under-performing on a known query.
// Keys are tool slugs (segment after /tools/). Absent slug = templated default.
export interface SeoOverride {
  /** Replaces `${tool.name} - Free Browser Tool`. Site suffix is still appended by the root layout. */
  title?: string;
  /** Replaces the templated description. ≤ 155 characters. */
  description?: string;
}

export const seoOverrides: Record<string, SeoOverride> = {
  // The ASCII tool converts images only (there is no text-to-ASCII mode), so
  // the title and description describe image input only.
  "ascii-art": {
    title: "ASCII Art Generator – Image to ASCII Converter",
    description:
      "Turn any photo or PNG into ASCII art. Set width and character set, invert or add colour, then copy, download .txt or export PNG. Runs in your browser.",
  },
  "depth-map": {
    title: "Free AI Depth Map Generator – Image to Depth Map",
    description:
      "Generate a depth map from any image with Depth Anything V2 running in your browser. Grayscale or colour output, PNG download. Free, no upload.",
  },
  // Search Console: 41k impressions at position 8.6, 5 clicks. Google answers
  // generic conversions with its own widget, so the title names the unit groups
  // and the description lists all six groups the component really has.
  "unit-converter": {
    title: "Unit Converter – Length, Weight, Temperature, Area & More",
    description:
      "Convert length, weight, temperature, area, volume and speed: metres to feet, kg to lb, °C to °F, acres, gallons, mph. Free, runs in your browser.",
  },
  "reorder-pdf-pages": {
    title: "Reorder PDF Pages – Drag, Rearrange & Delete Pages",
    description:
      "Rearrange PDF pages by dragging their thumbnails, delete the ones you don't need, then download the new PDF. Runs in your browser, so nothing is uploaded.",
  },
  "percentage-calculator": {
    title: "Percentage Calculator – % Of, % Change & Reverse %",
    description:
      "Find X% of a number, what percent one number is of another, percentage increase or decrease, add or subtract a percent, or reverse a percentage. Free.",
  },
  "loan-calculator": {
    title: "Loan Calculator – Monthly Payment & Amortization",
    description:
      "Enter loan amount, annual interest rate and term in years to see the monthly payment, total interest and a month-by-month amortization schedule. Free.",
  },
  "model-comparison": {
    title: "AI Model Comparison – LLM Pricing & Context Window",
    description:
      "Compare 13 AI models from OpenAI, Anthropic, Google, Meta, Mistral and DeepSeek on input and output price per 1M tokens, context window and tier.",
  },
  "keyboard-tester": {
    title: "Keyboard Tester – Test Every Key Online",
    description:
      "Press any key and watch it light up on a full on-screen keyboard. Tracks keys tested, recent key history and how many keys register at once. Free.",
  },
  "token-counter": {
    title: "Token Counter – Count Tokens for GPT-4o, Claude & Llama",
    description:
      "Paste text to count tokens for GPT-4o, Claude, Llama and Gemini. GPT-4o counts are exact, others are estimates. Free, no API key, runs in your browser.",
  },
  "color-palette": {
    title: "Color Palette Generator – Harmonies from One Color",
    description:
      "Pick a base color and generate complementary, triadic, analogous, tetradic or monochromatic palettes. Lock colors, copy HEX, RGB or HSL, export a PNG.",
  },
  "group-maker": {
    title: "Random Group Maker – Split Names into Teams",
    description:
      "Paste a list of names, choose the number of groups or people per group, and get randomized, balanced teams. Print the result. Runs in your browser.",
  },
  "ai-cost-calculator": {
    title: "AI API Cost Calculator – GPT, Claude & Gemini Pricing",
    description:
      "Estimate API cost from input tokens, output tokens and request count for 13 models from OpenAI, Anthropic, Google, Meta, Mistral and DeepSeek. Free.",
  },
  "word-unscrambler": {
    title: "Word Unscrambler – Unscramble Letters into Words",
    description:
      "Enter your letters and see every valid word you can make, grouped by length. Filter by minimum length or a required letter. Runs in your browser.",
  },
  "screen-recorder": {
    title: "Screen Recorder – Record Your Screen Online, Free",
    description:
      "Record your screen, a window or a tab, with optional microphone and webcam overlay. Save the video or export a GIF. Nothing is uploaded; no extension.",
  },
  "meme-generator": {
    title: "Meme Generator – Add Text to Your Own Image",
    description:
      "Upload an image, add Impact-style text, drag it into place, adjust size, color and outline, and download a PNG. No watermark and no upload.",
  },
  "clip-path-generator": {
    title: "CSS clip-path Generator – Polygon, Circle & Inset",
    description:
      "Drag polygon points on a live preview or tune circle, ellipse and inset shapes, then copy the clip-path CSS. Presets include triangle, hexagon and star.",
  },
  calculator: {
    title: "Online Calculator – Basic, Scientific & Graphing",
    description:
      "Free calculator with basic, scientific and graphing modes: trig in degrees or radians, logarithms, memory keys and plots of y = f(x). Runs in your browser.",
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages – Turn Pages 90° and Save",
    description:
      "Rotate individual PDF pages 90° at a time, or turn every page left or right, then download a PDF with the rotation saved. Runs in your browser; no upload.",
  },
  "text-encryption": {
    title: "Text Encryption – AES-256 Encrypt & Decrypt Online",
    description:
      "Encrypt and decrypt text with AES-256-GCM using a passphrase or a random key, via your browser's Web Crypto API. Your text never leaves your device.",
  },
  "morse-code": {
    title: "Morse Code Translator – Text to Morse & Back",
    description:
      "Convert text to Morse code and decode Morse back to text. Covers letters, numbers and common punctuation, with a reference chart and one-click copy. Free.",
  },
  timer: {
    title: "Online Timer & Countdown – Stopwatch Included",
    description:
      "Set a countdown in hours, minutes and seconds, or switch to a stopwatch. Fullscreen mode and a sound when time is up. Free, runs in your browser.",
  },
  "anagram-solver": {
    title: "Anagram Solver – Find Every Anagram of Your Letters",
    description:
      "Enter letters to find every word that uses all of them, or include shorter words grouped by length. Free; runs in your browser with a built-in word list.",
  },
  "wordle-solver": {
    title: "Wordle Solver – Find Words from Your Clues",
    description:
      "Type your letters, mark each tile gray, yellow or green, and see every 5-letter word that still fits. Runs in your browser with a built-in word list.",
  },
  "image-converter": {
    title: "Image Converter – JPG, PNG, WebP & AVIF Online",
    description:
      "Convert an image, including HEIC, to PNG, JPEG, WebP or AVIF with a quality slider. One file at a time, up to 15 MB. Runs in your browser; no upload.",
  },
  "image-captioner": {
    title: "AI Image Captioner – Generate Captions & Alt Text",
    description:
      "Generate a caption and ready-to-paste alt text for any image with an AI model that runs in your browser. Your image is never uploaded.",
  },
  "context-window": {
    title: "Context Window Calculator – Token Usage by Model",
    description:
      "Paste text to see tokens used, percent of the context window filled and tokens remaining for 13 AI models. Counts are estimates. Runs in your browser.",
  },
  "image-resizer": {
    title: "Image Resizer – Resize Photos by Pixels or Percent",
    description:
      "Resize an image by exact pixels, percentage, longest side or a preset like HD or Instagram. Lock aspect ratio, save as JPEG, PNG or WebP. No upload.",
  },
  "crop-image": {
    title: "Crop Image Online – Free Aspect Ratio Cropper",
    description:
      "Crop an image with drag handles or fixed ratios: square, 4:3, 3:4, 16:9 and 9:16. Export JPEG, PNG or WebP with adjustable quality. Runs in your browser.",
  },
  "favicon-generator": {
    title: "Favicon Generator – Create favicon.ico & PNG Icons",
    description:
      "Make a favicon set from an image, a letter or an emoji: PNGs from 16 to 512 px, favicon.ico, site.webmanifest and the HTML snippet in one ZIP. Free.",
  },
  "compress-signature-20kb": {
    title: "Compress Signature to 20KB – Free Online Tool",
    description:
      "Compress a signature image to about 20 KB for application forms. Upload a PNG, JPG or WebP; it saves as JPEG and tells you if the target was reached.",
  },
};

export function getSeoOverride(slug: string): SeoOverride | undefined {
  return Object.prototype.hasOwnProperty.call(seoOverrides, slug)
    ? seoOverrides[slug]
    : undefined;
}
