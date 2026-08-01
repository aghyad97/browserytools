/**
 * Search-index synonyms for the ⌘K command palette (Task 6.1) — alternative
 * phrasings for what a user wants to DO ("remove background", "ocr", "how
 * many tokens") rather than a tool's own name.
 *
 * Deliberately kept OUT of `src/lib/tools-config.ts`: that registry is parsed
 * by `scripts/validate-tools.js` with a naive non-greedy regex
 * (`items:\s*\[([\s\S]*?)\]`) that stops at the first `]` it sees — a
 * `keywords: [...]` array nested inside a tool object closes that regex
 * early and desyncs the whole parser. Keeping search-index data in its own
 * module sidesteps that fragile parser entirely (and avoids fighting over
 * the same file with anything else touching the registry).
 *
 * Keyed by slug (the last path segment of a tool's `href`). Every key is
 * asserted against the live catalog in
 * src/__tests__/lib/tool-synonyms.test.ts so a renamed/removed tool can't
 * leave a dangling, silently-dead entry here.
 *
 * Covers the AI/LLM-developer, PDF, and image clusters plus the on-device AI
 * tools (~75 of the highest-traffic tools) — not a thin pass over all 176.
 * 3-8 genuine alternative phrasings per tool; no keyword-stuffing. Two tools
 * that would otherwise fit the image cluster (`heic-to-jpg`, `heic-to-png`)
 * are deliberately excluded: they are `landingFor` SEO variants hidden from
 * the command palette (see `isHiddenVariant` in tools-config.ts), so keywords
 * on them would never be reachable.
 */
export const TOOL_SYNONYMS: Record<string, string[]> = {
  // --- AI Tools cluster ---
  "audio-transcriber": ["speech to text", "audio to text", "transcribe audio", "convert voice to text", "whisper transcription", "captions from audio"],
  "text-summarizer": ["summarize text", "tldr generator", "shorten an article", "condense text", "summary tool"],
  translator: ["translate text", "language translator", "translate offline", "on-device translation"],
  "pii-redactor": ["redact personal info", "remove pii", "anonymize text", "hide sensitive data", "mask names and emails", "scrub personal data"],
  "zero-shot-classifier": ["classify text", "text categorization", "label text without training", "topic classifier", "tag text by category"],
  "sentiment-analyzer": ["sentiment analysis", "is this positive or negative", "mood of text", "emotion detector", "analyze tone of text"],
  "token-counter": ["how many tokens", "gpt tokens", "count tokens", "llm token counter", "openai token calculator", "context length tokens"],
  "context-window": ["context length calculator", "how much text fits in context", "llm context window", "max tokens calculator"],
  "ai-cost-calculator": ["llm api cost", "gpt pricing calculator", "how much will this prompt cost", "openai cost estimator", "claude api pricing"],
  "model-comparison": ["compare llms", "gpt vs claude", "which ai model is best", "compare ai models", "llm benchmark comparison"],
  "system-prompt-builder": ["write a system prompt", "system prompt generator", "ai persona prompt", "craft an llm system message"],
  "prompt-library": ["prompt examples", "prompt templates", "chatgpt prompt ideas", "ready-made prompts"],
  "claude-md-generator": ["generate claude.md", "claude code config file", "ai coding agent instructions", "project instructions for claude"],
  "ai-rules-generator": ["cursor rules generator", "ai coding assistant rules", "cursorrules generator", "copilot instructions file"],
  "json-schema-builder": ["json schema generator", "build a json schema", "structured output schema", "function calling schema"],
  "mcp-config": ["mcp server config", "model context protocol setup", "claude mcp json", "generate mcp config"],
  "prompt-formatter": ["format a prompt", "clean up messy prompt", "prompt template formatter"],
  "skill-builder": ["create a claude skill", "agent skill builder", "build an ai agent", "custom gpt instructions"],
  "ai-instruction-diff": ["compare two prompts", "diff system prompts", "what changed in this prompt"],
  "text-similarity": ["compare two texts", "how similar are these texts", "duplicate text checker", "plagiarism style comparison"],

  // --- PDF cluster ---
  pdf: ["pdf tools", "edit a pdf", "pdf editor online", "work with pdf files"],
  "merge-pdf": ["combine pdf files", "join pdfs", "merge multiple pdfs into one", "pdf combiner"],
  "split-pdf": ["separate pdf pages", "extract pages from pdf", "divide pdf into files", "pdf splitter"],
  "compress-pdf": ["reduce pdf file size", "shrink pdf", "make pdf smaller", "pdf size reducer"],
  "rotate-pdf": ["fix sideways pdf pages", "turn pdf pages", "rotate pdf pages online"],
  "watermark-pdf": ["add watermark to pdf", "stamp pdf with logo", "brand a pdf document"],
  "sign-pdf": ["add signature to pdf", "esign a pdf", "sign document online", "electronic signature pdf"],
  "extract-text-from-pdf": ["get text out of pdf", "copy text from pdf", "pdf to text", "pull text from scanned pdf"],
  "reorder-pdf-pages": ["rearrange pdf pages", "change page order pdf", "move pdf pages around"],
  "jpg-to-pdf": ["convert image to pdf", "photos to pdf", "jpg to pdf converter", "picture to pdf"],
  "pdf-to-word": ["convert pdf to editable word doc", "pdf to docx", "make pdf editable"],
  "word-to-pdf": ["convert word doc to pdf", "docx to pdf", "save word as pdf"],

  // --- Image cluster ---
  "image-upscaler": ["increase image resolution", "upscale a photo", "make image bigger without blur", "ai image upscaling", "enhance low res photo"],
  "image-captioner": ["generate alt text", "describe an image with ai", "auto caption a photo", "ai image description"],
  "depth-map": ["3d depth from photo", "depth estimation image", "generate depth map from picture"],
  "object-cutout": ["cut out an object from photo", "segment anything", "isolate subject in image", "click to cut out", "remove object from image"],
  "ascii-art": ["convert image to text art", "photo to ascii", "text art generator from image"],
  "photo-collage": ["combine photos into one", "make a photo grid", "collage maker"],
  "exif-remover": ["strip photo metadata", "remove gps location from photo", "clean exif data", "remove hidden photo info"],
  "screenshot-beautifier": ["add browser frame to screenshot", "pretty screenshot generator", "screenshot with background", "make screenshot look nice"],
  "meme-generator": ["make a meme", "add text to image meme style", "meme maker online"],
  "bg-removal": ["remove background from image", "transparent png", "cut out background", "background eraser", "make background transparent"],
  "phone-mockups": ["put screenshot in phone frame", "device mockup generator", "iphone screenshot frame"],
  "image-compression": ["reduce photo file size", "compress jpg or png", "shrink image size", "make photo smaller for upload"],
  "image-converter": ["convert image format", "heic to jpg webp png converter", "change image file type"],
  "color-correction": ["adjust photo colors", "fix photo white balance", "color grade an image"],
  svg: ["edit svg files", "svg viewer and editor", "optimize svg", "change svg colors"],
  "svg-png": ["convert svg to png", "rasterize svg", "svg to image"],
  "photo-censor": ["blur faces in photo", "pixelate part of image", "censor image", "blur license plate photo"],
  "image-resizer": ["resize photo dimensions", "change image width and height", "scale down a picture"],
  "exif-viewer": ["see photo metadata", "check camera settings from photo", "view gps location in photo"],
  "favicon-generator": ["make a favicon", "generate site icon", "favicon.ico creator"],
  "crop-image": ["cut part of a photo", "trim image edges", "crop a picture online"],
  "watermark-image": ["add watermark to photo", "stamp logo on image", "protect photo with text overlay"],

  // --- On-device AI extras (Media / Text categories) ---
  "subtitle-studio": ["auto generate subtitles", "add captions to video", "burn subtitles into video", "srt generator from video"],
  "speech-to-text": ["live dictation", "voice typing", "talk to text", "microphone transcription"],
  "text-to-speech": ["read text aloud", "convert text to voice", "tts generator", "text to audio"],
  "image-to-text": ["ocr", "scan text from photo", "extract text from image", "picture to text", "read text from screenshot"],

  // --- Developer / security cluster ---
  "uuid-generator": ["generate a guid", "random unique id", "uuid v4 generator"],
  "unix-timestamp": ["epoch time converter", "unix time to date", "timestamp to human readable date"],
  "regex-tester": ["test a regular expression", "regex debugger", "check if regex matches"],
  "cron-parser": ["explain a cron expression", "what does this cron schedule mean", "cron to human readable"],
  "http-status": ["http error code meaning", "what does 404 mean", "list of status codes"],
  "css-minifier": ["shrink css file", "minify stylesheet", "compress css code"],
  "sql-formatter": ["format sql query", "beautify sql", "pretty print sql"],
  chmod: ["file permission calculator", "linux chmod numbers", "unix permissions explained"],
  "meta-tags": ["generate seo meta tags", "og image tags generator", "html head tags for seo"],
  "curl-converter": ["convert curl to code", "curl to python fetch axios", "turn curl command into code"],
  "code-format": ["beautify code", "pretty print code", "format messy code"],
  "html-formatter": ["beautify html", "format html code", "indent html"],
  "json-formatter": ["format json", "pretty print json", "validate json", "json viewer", "minify json"],
  "jwt-decoder": ["decode a jwt token", "read jwt payload", "inspect auth token"],
  "hash-generator": ["generate md5 sha256 hash", "checksum generator", "hash a string"],
  "password-generator": ["random password generator", "strong password maker", "generate secure password"],
  "totp-generator": ["2fa code generator", "authenticator app code", "generate otp code"],
};

/** Curated alternative phrasings for a tool slug, or `undefined` if none. */
export function synonymsFor(slug: string): string[] | undefined {
  return TOOL_SYNONYMS[slug];
}
