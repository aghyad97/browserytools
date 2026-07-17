import {
  ShuffleIcon,
  BrainIcon,
  BookMinusIcon,
  FileDownIcon,
  HammerIcon,
  ImagesIcon,
  SquarePlayIcon,
  FileIcon,
  CodeIcon,
  VideoIcon,
  FilmIcon,
  FileTextIcon,
  Grid3X3Icon,
  TicketIcon,
  PaintRollerIcon,
  DatabaseIcon,
  FileArchiveIcon,
  FileImageIcon,
  TypeIcon,
  HashIcon,
  QrCodeIcon,
  CalculatorIcon,
  ShieldIcon,
  ReceiptIcon,
  SmartphoneIcon,
  BarcodeIcon,
  CheckSquareIcon,
  ClockIcon,
  CameraIcon,
  GlobeIcon,
  CalendarIcon,
  KeyIcon,
  PaletteIcon,
  CalendarClockIcon,
  DollarSignIcon,
  BarChart3Icon,
  CoinsIcon,
  BracesIcon,
  TextCursorInputIcon,
  LinkIcon,
  ImageIcon,
  NotebookIcon,
  LockIcon,
  TimerIcon,
  RefreshCwIcon,
  SwatchBookIcon,
  ScaleIcon,
  UserIcon,
  ServerIcon,
  GraduationCapIcon,
  MonitorIcon,
  PercentIcon,
  BinaryIcon,
  CpuIcon,
  SunIcon,
  WrenchIcon,
  ZapIcon,
  ArrowUpNarrowWideIcon,
  RadioIcon,
  RepeatIcon,
  SmileIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  SplitIcon,
  Columns2Icon,
  FileJson2Icon,
  SquareIcon,
  GitBranchIcon,
  TagIcon,
  TableIcon,
  TerminalIcon,
  ScanTextIcon,
  Volume2Icon,
  DicesIcon,
  LayoutGridIcon,
  ShareIcon,
  PipetteIcon,
  EraserIcon,
  SignatureIcon,
  MicIcon,
  ScissorsIcon,
  SplineIcon,
  LayersIcon,
  ShapesIcon,
  AtomIcon,
  NetworkIcon,
  ExpandIcon,
  TextQuoteIcon,
  LanguagesIcon,
  ListChecksIcon,
  CropIcon,
  StampIcon,
  Gamepad2Icon,
  KeyboardIcon,
  CombineIcon,
  ShrinkIcon,
  RotateCwIcon,
  FileOutputIcon,
  ListOrderedIcon,
  Disc3Icon,
  UsersIcon,
  Clock4Icon,
  SquareStackIcon,
  PuzzleIcon,
} from "lucide-react";

export interface Tool {
  name: string;
  href: string;
  icon: any;
  available: boolean;
  description: string;
  order: number;
  creationDate: string; // ISO date string (YYYY-MM-DD)
  /** False when the tool depends on a live network call (e.g. exchange-rate
   * APIs) and can't honestly claim to run fully on-device. Absent/true means
   * the default on-device promise applies. */
  onDevice?: boolean;
  /** Present ONLY on SEO landing-page variants (e.g. `compress-image-to-20kb`)
   * whose value is the canonical tool's slug. Landing variants are real
   * tools-config entries (so they inherit sitemap/metadata/route/e2e plumbing
   * via getAllTools) but are hidden from the homepage grid, the marketing tool
   * count (getCatalogTools / roundedToolCount), and other tools' related tiles.
   * Field-order note: `landingFor` is an optional and MUST follow `onDevice`
   * (after `creationDate`) — scripts/generate-tool-routes.mjs regexes the
   * name → href → … available prefix, so keep required fields ahead of it. */
  landingFor?: string;
  /** Set on a `landingFor` variant that should ALSO surface as its own grid
   * card — a distinct user intent (e.g. the PDF operations merge/split/sign)
   * that happens to share an implementation with its canonical tool. Such a
   * variant is shown in the grid, counted, and searchable in the palette,
   * while still belonging to its canonical's family for related tiles. Plain
   * SEO long-tail variants (e.g. `compress-image-to-20kb`, the same tool at a
   * preset) leave this unset and stay hidden. */
  inGrid?: boolean;
}

export interface ToolCategory {
  category: string;
  id: string;
  items: Tool[];
  order: number;
}

export const tools: ToolCategory[] = [
  {
    category: "Image Tools",
    id: "imageTools",
    order: 1,
    items: [
      {
        name: "Image Upscaler",
        href: "/tools/image-upscaler",
        icon: ExpandIcon,
        available: true,
        order: 16,
        creationDate: "2026-05-22",
        description:
          "Upscale and enhance images 2x with an on-device AI super-resolution model. Increase image resolution for free, privately, with no upload.",
      },
      {
        name: "Image Captioner",
        href: "/tools/image-captioner",
        icon: ImageIcon,
        available: true,
        order: 17,
        creationDate: "2026-05-22",
        description:
          "Generate a descriptive caption and ready-to-use alt text for any image with an on-device AI model. Great for accessibility and SEO. Free, private, no upload.",
      },
      {
        name: "Depth Map Generator",
        href: "/tools/depth-map",
        icon: LayersIcon,
        available: true,
        order: 18,
        creationDate: "2026-05-22",
        description:
          "Generate a depth map from any image with an on-device AI model. Grayscale or colormap output, downloadable PNG. Free, private, no upload.",
      },
      {
        name: "Object Cutout",
        href: "/tools/object-cutout",
        icon: ScissorsIcon,
        available: true,
        order: 19,
        creationDate: "2026-05-22",
        description:
          "Cut out any object from an image with one click using the Segment Anything (SAM) AI model in your browser. Get a transparent PNG. Free, private, no upload.",
      },
      {
        name: "ASCII Art Generator",
        href: "/tools/ascii-art",
        icon: TypeIcon,
        available: true,
        order: 15,
        creationDate: "2026-05-21",
        description:
          "Convert any image into ASCII art in your browser. Adjust width, pick a character ramp, invert, and add color. Copy the text, download a .txt, or export a PNG.",
      },
      {
        name: "Photo Collage",
        href: "/tools/photo-collage",
        icon: LayoutGridIcon,
        available: true,
        order: 12,
        creationDate: "2026-05-21",
        description:
          "Combine multiple photos into a collage with grid, strip, and mosaic layouts. Adjust spacing, corner radius, background, and output size, then export as PNG or JPEG. 100% in your browser.",
      },
      {
        name: "EXIF Remover",
        href: "/tools/exif-remover",
        icon: EraserIcon,
        available: true,
        order: 14,
        creationDate: "2026-05-21",
        description:
          "Strip EXIF metadata - GPS location, camera model, timestamps - from photos before sharing. See what your image reveals, then download a clean copy. Batch supported, 100% in your browser.",
      },
      {
        name: "Screenshot Beautifier",
        href: "/tools/screenshot-beautifier",
        icon: ImageIcon,
        available: true,
        order: 10,
        creationDate: "2026-05-21",
        description:
          "Turn plain screenshots into beautiful images. Add gradient or mesh backgrounds, padding, rounded corners, drop shadows, a macOS window frame or browser bar, and 3D tilt. Export as PNG. Runs fully in your browser.",
      },
      {
        name: "Meme Generator",
        href: "/tools/meme-generator",
        icon: SmileIcon,
        available: true,
        order: 11,
        creationDate: "2026-05-21",
        description:
          "Make a meme online for free. Upload an image, add Impact-font top and bottom text, drag to position, style each line, and download as PNG. No upload, no watermark.",
      },
      {
        name: "Background Removal",
        href: "/tools/bg-removal",
        icon: ImagesIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Remove background from your images instantly using AI. Perfect for product photos, portraits, and graphics. Supports PNG, JPG, and other formats. No watermark, completely free.",
      },
      {
        name: "Phone Mockups",
        href: "/tools/phone-mockups",
        icon: SmartphoneIcon,
        available: true,
        order: 2,
        creationDate: "2025-09-01",
        description:
          "Place screenshots into iPhone/Android device frames. Upload a screenshot, choose a frame, adjust fit, background, and export.",
      },
      {
        name: "Image Compression",
        href: "/tools/image-compression",
        icon: FileDownIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Compress images to reduce file size while maintaining quality. Perfect for web optimization, email attachments, and storage. Supports JPG, PNG, and WebP.",
      },
      {
        name: "Format Converter",
        href: "/tools/image-converter",
        icon: HammerIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Convert images between different formats like JPG, PNG, WebP, GIF, BMP, TIFF, and SVG. Batch conversion supported. Optimize for web or print.",
      },
      {
        name: "Color Correction",
        href: "/tools/color-correction",
        icon: PaintRollerIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Adjust colors, brightness, contrast, saturation, and hue in images. Enhance photos, fix lighting issues, and create artistic effects. Works with all image formats.",
      },
      {
        name: "SVG Tools",
        href: "/tools/svg",
        icon: FileImageIcon,
        available: true,
        order: 6,
        creationDate: "2025-09-20",
        description:
          "Edit and manipulate SVG vector graphics. Scale, modify colors, optimize paths, and convert to other formats. Ideal for logos, icons, and scalable graphics.",
      },
      {
        name: "SVG to PNG",
        href: "/tools/svg-png",
        icon: RefreshCwIcon,
        available: true,
        order: 8,
        creationDate: "2026-05-21",
        description:
          "Convert SVG vector files to PNG images. Upload or paste SVG markup and export at 1x, 2x, or 3x resolution. Runs entirely in your browser.",
      },
      {
        name: "Photo Censor",
        href: "/tools/photo-censor",
        icon: EyeOffIcon,
        available: true,
        order: 9,
        creationDate: "2026-05-21",
        description:
          "Redact sensitive parts of an image with blur, pixelate, or black-box censoring. Draw rectangular regions over faces, names, or numbers and export to PNG, JPEG, or WebP. 100% private — processed entirely in your browser.",
      },
      {
        name: "Image Resizer",
        href: "/tools/image-resizer",
        icon: ImageIcon,
        available: true,
        order: 20,
        creationDate: "2026-02-20",
        description:
          "Resize images to exact dimensions or by percentage. Lock aspect ratio, choose output format, and adjust quality. No file size limits, runs fully in browser.",
      },
      {
        name: "EXIF Viewer",
        href: "/tools/exif-viewer",
        icon: InfoIcon,
        available: true,
        order: 22,
        creationDate: "2026-02-22",
        description:
          "View EXIF metadata from photos: camera model, lens, aperture, shutter speed, ISO, GPS coordinates, and more. No upload — processed locally.",
      },
      {
        name: "Favicon Generator",
        href: "/tools/favicon-generator",
        icon: ImageIcon,
        available: true,
        order: 23,
        creationDate: "2026-05-21",
        description:
          "Create a complete favicon set from an image or a letter/emoji. Generates 16, 32, 48, 180, 192, and 512 PNGs plus a multi-size favicon.ico, a site.webmanifest, and the HTML link snippet — bundled in a ZIP. Runs fully in your browser.",
      },
      {
        name: "Crop Image",
        href: "/tools/crop-image",
        icon: CropIcon,
        available: true,
        order: 21,
        creationDate: "2026-07-16",
        description:
          "Crop images online with aspect-ratio presets and precise drag handles. Export to JPG, PNG, or WebP.",
      },
      {
        name: "Watermark Image",
        href: "/tools/watermark-image",
        icon: StampIcon,
        available: true,
        order: 22,
        creationDate: "2026-07-16",
        description:
          "Add text or logo watermarks to photos — position, opacity, rotation, and tiling. All in your browser.",
      },
      // SEO landing variants of Image Compression — hidden from grid/count/
      // related pools via `landingFor` (Task 2 infra).
      {
        name: "Compress Image to 20KB",
        href: "/tools/compress-image-to-20kb",
        icon: FileDownIcon,
        available: true,
        order: 60,
        creationDate: "2026-07-16",
        description:
          "Shrink any photo to 20 kilobytes or less for application forms and portals with strict size limits.",
        landingFor: "image-compression",
      },
      {
        name: "Compress Image to 50KB",
        href: "/tools/compress-image-to-50kb",
        icon: FileDownIcon,
        available: true,
        order: 61,
        creationDate: "2026-07-16",
        description:
          "Reduce image file size to 50KB for exam portals, job applications, and email attachments.",
        landingFor: "image-compression",
      },
      {
        name: "Compress Image to 100KB",
        href: "/tools/compress-image-to-100kb",
        icon: FileDownIcon,
        available: true,
        order: 62,
        creationDate: "2026-07-16",
        description:
          "Get any picture under 100KB while keeping it sharp — made for upload limits.",
        landingFor: "image-compression",
      },
      {
        name: "Compress Image to 200KB",
        href: "/tools/compress-image-to-200kb",
        icon: FileDownIcon,
        available: true,
        order: 63,
        creationDate: "2026-07-16",
        description:
          "Compress photos to 200KB or less for CMS uploads, listings, and document portals.",
        landingFor: "image-compression",
      },
      {
        name: "Compress Image to 500KB",
        href: "/tools/compress-image-to-500kb",
        icon: FileDownIcon,
        available: true,
        order: 64,
        creationDate: "2026-07-16",
        description:
          "Bring large photos under 500KB without visible quality loss.",
        landingFor: "image-compression",
      },
      {
        name: "Compress Image to 1MB",
        href: "/tools/compress-image-to-1mb",
        icon: FileDownIcon,
        available: true,
        order: 65,
        creationDate: "2026-07-16",
        description:
          "Compress high-resolution photos to under 1MB for email, forms, and faster sharing.",
        landingFor: "image-compression",
      },
      {
        name: "Compress JPEG to 50KB",
        href: "/tools/compress-jpeg-to-50kb",
        icon: FileDownIcon,
        available: true,
        order: 66,
        creationDate: "2026-07-16",
        description:
          "Reduce JPEG file size to 50KB with smart quality search, right in your browser.",
        landingFor: "image-compression",
      },
      {
        name: "Compress JPEG to 100KB",
        href: "/tools/compress-jpeg-to-100kb",
        icon: FileDownIcon,
        available: true,
        order: 67,
        creationDate: "2026-07-16",
        description:
          "Compress JPG photos to 100KB for portals and websites that cap upload size.",
        landingFor: "image-compression",
      },
      {
        name: "Compress JPEG to 200KB",
        href: "/tools/compress-jpeg-to-200kb",
        icon: FileDownIcon,
        available: true,
        order: 68,
        creationDate: "2026-07-16",
        description: "Shrink JPG images to 200KB while preserving detail.",
        landingFor: "image-compression",
      },
      {
        name: "Compress Signature to 20KB",
        href: "/tools/compress-signature-20kb",
        icon: FileDownIcon,
        available: true,
        order: 69,
        creationDate: "2026-07-16",
        description:
          "Resize and compress your signature image to 10–20KB for online application forms.",
        landingFor: "image-compression",
      },
      // SEO landing variants of Format Converter — hidden from grid/count/
      // related pools via `landingFor` (Task 2 infra).
      {
        name: "HEIC to JPG",
        href: "/tools/heic-to-jpg",
        icon: ImageIcon,
        available: true,
        order: 70,
        creationDate: "2026-07-16",
        description:
          "Convert iPhone HEIC photos to JPG right in your browser — no upload, instant download.",
        landingFor: "image-converter",
      },
      {
        name: "HEIC to PNG",
        href: "/tools/heic-to-png",
        icon: ImageIcon,
        available: true,
        order: 71,
        creationDate: "2026-07-16",
        description:
          "Convert HEIC images to lossless PNG locally in your browser.",
        landingFor: "image-converter",
      },
    ],
  },
  {
    category: "File Tools",
    id: "fileTools",
    order: 3,
    items: [
      {
        name: "PDF Tools",
        href: "/tools/pdf",
        icon: FileTextIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "The full PDF workbench: merge, split, compress, rotate, reorder, watermark, sign, extract text, and turn images into PDFs — all in your browser.",
      },
      // SEO landing variants of PDF Tools — hidden from grid/count/related
      // pools via `landingFor` (Task 2 infra).
      {
        name: "Merge PDF",
        href: "/tools/merge-pdf",
        icon: CombineIcon,
        available: true,
        order: 60,
        creationDate: "2026-07-16",
        description:
          "Combine multiple PDF files into one document, in order, right in your browser.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Split PDF",
        href: "/tools/split-pdf",
        icon: ScissorsIcon,
        available: true,
        order: 61,
        creationDate: "2026-07-16",
        description:
          "Extract pages or page ranges from a PDF into separate files — no upload.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Compress PDF",
        href: "/tools/compress-pdf",
        icon: ShrinkIcon,
        available: true,
        order: 62,
        creationDate: "2026-07-16",
        description:
          "Shrink PDF file size in your browser with three quality presets.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Rotate PDF",
        href: "/tools/rotate-pdf",
        icon: RotateCwIcon,
        available: true,
        order: 63,
        creationDate: "2026-07-16",
        description:
          "Rotate PDF pages permanently — single pages or the whole document.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Watermark PDF",
        href: "/tools/watermark-pdf",
        icon: StampIcon,
        available: true,
        order: 64,
        creationDate: "2026-07-16",
        description:
          "Stamp DRAFT, CONFIDENTIAL, or any text across every page of a PDF.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Sign PDF",
        href: "/tools/sign-pdf",
        icon: SignatureIcon,
        available: true,
        order: 65,
        creationDate: "2026-07-16",
        description:
          "Draw or upload your signature and place it on any page — files never leave your device.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Extract Text from PDF",
        href: "/tools/extract-text-from-pdf",
        icon: FileOutputIcon,
        available: true,
        order: 66,
        creationDate: "2026-07-16",
        description:
          "Pull selectable text out of a PDF and copy or download it as .txt.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Reorder PDF Pages",
        href: "/tools/reorder-pdf-pages",
        icon: ListOrderedIcon,
        available: true,
        order: 67,
        creationDate: "2026-07-16",
        description:
          "Drag and drop to rearrange or delete PDF pages, then save.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "JPG to PDF",
        href: "/tools/jpg-to-pdf",
        icon: FileImageIcon,
        available: true,
        order: 68,
        creationDate: "2026-07-16",
        description:
          "Turn JPG and PNG images into a single PDF with page size and margin controls.",
        landingFor: "pdf",
        inGrid: true,
      },
      {
        name: "Zip Tools",
        href: "/tools/zip",
        icon: FileArchiveIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Create ZIP archives from your files and extract existing ones, right in your browser.",
      },
      {
        name: "CSV/Excel Viewer",
        href: "/tools/spreadsheet",
        icon: Grid3X3Icon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "View CSV and Excel files in your browser: sort, search, chart a column, and export the filtered view to CSV.",
      },
      {
        name: "Data Format Converter",
        href: "/tools/file-converter",
        icon: FileIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Convert data between CSV, TSV, JSON, XML, and YAML. Paste text, pick a target format, copy the result.",
      },
    ],
  },

  {
    category: "Media Tools",
    id: "mediaTools",
    order: 4,
    items: [
      {
        name: "Video Editor",
        href: "/tools/video",
        icon: VideoIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Trim video clips and turn them into animated GIFs, right in your browser.",
      },
      {
        name: "Audio Editor",
        href: "/tools/audio",
        icon: SquarePlayIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Play audio files with adjustable volume and speed, view the waveform, and download your file.",
      },
      {
        name: "Mic & Camera Tester",
        href: "/tools/mic-camera",
        icon: CameraIcon,
        available: true,
        order: 3,
        creationDate: "2025-09-10",
        description:
          "Check your camera preview and test microphone input levels with a live meter.",
      },
      {
        name: "Compress Video",
        href: "/tools/compress-video",
        icon: FileDownIcon,
        available: true,
        order: 4,
        creationDate: "2026-05-21",
        description:
          "Compress videos in your browser using ffmpeg.wasm. Control quality (CRF), presets, and resolution. No uploads; runs entirely on-device.",
      },
      {
        name: "Screen Recorder",
        href: "/tools/screen-recorder",
        icon: MonitorIcon,
        available: true,
        order: 5,
        creationDate: "2026-02-20",
        description:
          "Record your screen, window, or tab directly in the browser using the Screen Capture API. Add a webcam picture-in-picture overlay, a 3-2-1 countdown, and export to WebM or animated GIF. No extensions or software needed.",
      },
      {
        name: "GIF Maker",
        href: "/tools/gif-maker",
        icon: FilmIcon,
        available: true,
        order: 6,
        creationDate: "2026-06-28",
        description:
          "Turn a series of images into an animated GIF right in your browser. Reorder frames, set the frame delay, loop or boomerang, resize, and pick quality. No uploads — runs entirely on-device.",
      },
      // SEO landing variants of Mic & Camera Tester — hidden from grid/count/
      // related pools via `landingFor` (Task 2 infra).
      {
        name: "Mic Test",
        href: "/tools/mic-test",
        icon: MicIcon,
        available: true,
        order: 60,
        creationDate: "2026-07-16",
        description:
          "Check your microphone in seconds with a live level meter — before the call, not during it.",
        landingFor: "mic-camera",
      },
      {
        name: "Webcam Test",
        href: "/tools/webcam-test",
        icon: VideoIcon,
        available: true,
        order: 61,
        creationDate: "2026-07-16",
        description:
          "Preview your camera and check quality before a meeting. Nothing is recorded or uploaded.",
        landingFor: "mic-camera",
      },
    ],
  },
  {
    category: "Text & Language Tools",
    id: "textLanguage",
    order: 5,
    items: [
      {
        name: "Live Dictation (mic)",
        href: "/tools/speech-to-text",
        icon: MicIcon,
        available: true,
        order: 18,
        creationDate: "2026-05-21",
        description:
          "Convert speech to text online for free. Voice typing and dictation in your browser using the Web Speech API, with continuous recognition, interim results, multiple languages, copy, and download.",
      },
      {
        name: "Image to Text (OCR)",
        href: "/tools/image-to-text",
        icon: ScanTextIcon,
        available: true,
        order: 16,
        creationDate: "2026-05-21",
        description:
          "Extract text from images for free with on-device OCR. Drag and drop a photo, screenshot, or scan and get editable, copyable text. Supports English, Spanish, French, German, and Arabic. Runs entirely in your browser.",
      },
      {
        name: "Text to Speech",
        href: "/tools/text-to-speech",
        icon: Volume2Icon,
        available: true,
        order: 17,
        creationDate: "2026-05-21",
        description:
          "Read text aloud in your browser for free. Convert text to speech with adjustable voice, rate, pitch, and volume using the Web Speech API. No upload, no account.",
      },
      {
        name: "Text Case Converter",
        href: "/tools/text-case",
        icon: TypeIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Convert text between different cases: uppercase, lowercase, title case, camelCase, snake_case, and more. Perfect for coding and content formatting.",
      },
      {
        name: "Text Counter",
        href: "/tools/text-counter",
        icon: HashIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Count words, characters, lines, and paragraphs in text. Analyze readability, estimate reading time, and get detailed statistics for content analysis.",
      },
      {
        name: "Rich Editor",
        href: "/tools/rich-editor",
        icon: BookMinusIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Edit and preview rich text documents with formatting options. Create documents with bold, italic, lists, links, and more. Export to HTML or Markdown.",
      },
      {
        name: "Lorem Ipsum Generator",
        href: "/tools/lorem-ipsum",
        icon: FileTextIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Generate placeholder text for designs and mockups. Customize length, paragraphs, and format. Perfect for web design, presentations, and prototyping.",
      },
      {
        name: "Text Diff Viewer",
        href: "/tools/text-diff",
        icon: FileTextIcon,
        available: true,
        order: 7,
        creationDate: "2025-09-10",
        description: "Compare two texts and copy a simple patch.",
      },
      {
        name: "Markdown Editor",
        href: "/tools/markdown-editor",
        icon: FileTextIcon,
        available: true,
        order: 8,
        creationDate: "2026-02-20",
        description:
          "Write Markdown with a live split-pane preview. Supports GFM tables, code blocks, and task lists. Export as Markdown or HTML.",
      },
      {
        name: "Notepad",
        href: "/tools/notepad",
        icon: NotebookIcon,
        available: true,
        order: 10,
        creationDate: "2026-02-20",
        description:
          "A distraction-free scratch pad that saves your notes automatically to the browser. Supports multiple notes with titles and timestamps.",
      },
      {
        name: "Text Sorter",
        href: "/tools/text-sorter",
        icon: ArrowUpNarrowWideIcon,
        available: true,
        order: 11,
        creationDate: "2026-02-22",
        description:
          "Sort lines of text alphabetically, by length, or numerically. Remove duplicates, reverse order, shuffle randomly, and trim whitespace.",
      },
      {
        name: "Word Frequency Analyzer",
        href: "/tools/word-frequency",
        icon: BarChart3Icon,
        available: true,
        order: 13,
        creationDate: "2026-02-22",
        description:
          "Analyze word frequency in any text. Find the most common words, filter stop words, and export results as CSV. Useful for SEO and writing analysis.",
      },
      {
        name: "Markdown to HTML",
        href: "/tools/markdown-html",
        icon: CodeIcon,
        available: true,
        order: 14,
        creationDate: "2026-02-22",
        description:
          "Convert Markdown to clean HTML instantly. Supports GFM tables, task lists, code blocks, and more. Copy the HTML output or download as a file.",
      },
      {
        name: "Text Repeater",
        href: "/tools/text-repeater",
        icon: RepeatIcon,
        available: true,
        order: 15,
        creationDate: "2026-02-22",
        description:
          "Repeat any text or character N times with a custom separator. Useful for generating test data, placeholder content, and patterns.",
      },
      {
        name: "Markdown Table Generator",
        href: "/tools/markdown-table",
        icon: TableIcon,
        available: true,
        order: 15,
        creationDate: "2026-03-05",
        description:
          "Build tables in a visual grid editor and export as valid Markdown table syntax. Control column alignment per column.",
      },
      {
        name: "Word Unscrambler",
        href: "/tools/word-unscrambler",
        icon: ShuffleIcon,
        available: true,
        order: 19,
        creationDate: "2026-07-17",
        description:
          "Unscramble letters into valid words. Filter by minimum length or a required letter, and browse matches grouped by word length.",
      },
      {
        name: "Wordle Solver",
        href: "/tools/wordle-solver",
        icon: SquareStackIcon,
        available: true,
        order: 20,
        creationDate: "2026-07-17",
        description:
          "Solve Wordle puzzles fast. Mark each tile gray, yellow, or green and instantly see every valid candidate word.",
      },
      {
        name: "Anagram Solver",
        href: "/tools/anagram-solver",
        icon: PuzzleIcon,
        available: true,
        order: 21,
        creationDate: "2026-07-17",
        description:
          "Find every anagram of a set of letters. Optionally include shorter sub-anagrams, grouped by word length.",
      },
    ],
  },
  {
    category: "Data Tools",
    id: "dataTools",
    order: 6,
    items: [
      {
        name: "JSON to CSV",
        href: "/tools/json-csv",
        icon: DatabaseIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Convert JSON data to CSV format for spreadsheet applications. Handle nested objects, arrays, and complex data structures. Perfect for data analysis and reporting.",
      },
      {
        name: "Base64 Tools",
        href: "/tools/base64",
        icon: DatabaseIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Encode or decode Base64 strings and files. Convert images, documents, and binary data to text format. Essential for web development and data transmission.",
      },
      {
        name: "QR Code Generator",
        href: "/tools/qr-generator",
        icon: QrCodeIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Generate QR codes from text, URLs, contact information, and more. Customize colors, size, and error correction. Download as PNG, SVG, or PDF.",
      },
      {
        name: "Barcode Generator",
        href: "/tools/barcode-generator",
        icon: BarcodeIcon,
        available: true,
        order: 4,
        creationDate: "2025-08-20",
        description:
          "Generate various barcode types including CODE128, EAN-13, UPC-A, CODE39, and more. Customize appearance and download as PNG. Perfect for inventory, retail, and logistics.",
      },
      {
        name: "QR Code Scanner",
        href: "/tools/qr-scanner",
        icon: CameraIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Scan QR codes using your camera or upload an image. Get instant results with copy and download options. Perfect for quickly accessing URLs, contact info, and other QR data.",
      },
      {
        name: "Barcode Scanner",
        href: "/tools/barcode-scanner",
        icon: CameraIcon,
        available: true,
        order: 6,
        creationDate: "2025-08-20",
        description:
          "Scan barcodes using your camera or upload an image. Supports multiple barcode formats including EAN-13, UPC-A, CODE128, and more. Get instant results with validation.",
      },
      {
        name: "Charts",
        href: "/tools/charts",
        icon: BarChart3Icon,
        available: true,
        order: 7,
        creationDate: "2025-09-19",
        description:
          "Create beautiful, customizable charts with full control over every detail. Support for area, bar, line, pie, radar, and radial charts with multiple export options.",
      },
      {
        name: "YAML ↔ JSON",
        href: "/tools/yaml-json",
        icon: RefreshCwIcon,
        available: true,
        order: 9,
        creationDate: "2026-02-20",
        description:
          "Convert between YAML and JSON formats instantly. Validate syntax, format output, and switch between human-readable YAML and machine-readable JSON.",
      },
      {
        name: "URL Encoder/Decoder",
        href: "/tools/url-encoder",
        icon: LinkIcon,
        available: true,
        order: 10,
        creationDate: "2026-02-20",
        description:
          "Encode or decode URLs and query strings. Percent-encode special characters and decode percent-encoded strings. Essential for web developers and API debugging.",
      },
      {
        name: "Fake Data Generator",
        href: "/tools/fake-data",
        icon: UserIcon,
        available: true,
        order: 11,
        creationDate: "2026-02-20",
        description:
          "Generate realistic fake data for testing and prototyping. Names, emails, addresses, phone numbers, credit cards, UUIDs, and more. Export as JSON or CSV.",
      },
      {
        name: "Text to Binary",
        href: "/tools/text-binary",
        icon: BinaryIcon,
        available: true,
        order: 12,
        creationDate: "2026-02-20",
        description:
          "Convert text to binary, hexadecimal, octal, and decimal representations. Decode binary/hex back to text. Useful for encoding, security, and low-level programming.",
      },
      {
        name: "JSON → TypeScript",
        href: "/tools/json-to-ts",
        icon: FileJson2Icon,
        available: true,
        order: 13,
        creationDate: "2026-03-05",
        description:
          "Paste JSON and instantly get TypeScript interfaces. Handles nested objects, arrays, optional fields, and union types.",
      },
      {
        name: "Mermaid Diagram Viewer",
        href: "/tools/mermaid",
        icon: GitBranchIcon,
        available: true,
        order: 14,
        creationDate: "2026-03-05",
        description:
          "Write Mermaid markdown and see your diagram rendered live. Supports flowcharts, sequence diagrams, ER diagrams, and more.",
      },
      {
        name: "Morse Code Converter",
        href: "/tools/morse-code",
        icon: RadioIcon,
        available: true,
        order: 15,
        creationDate: "2026-02-22",
        description:
          "Convert text to Morse code and decode Morse code back to text. Supports all letters, numbers, and punctuation. Copy or play audio beeps.",
      },
    ],
  },
  {
    category: "Math & Finance Tools",
    id: "mathFinance",
    order: 7,
    items: [
      {
        name: "Unit Converter",
        href: "/tools/unit-converter",
        icon: CalculatorIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Convert between different units of measurement including length, weight, temperature, area, volume, and more. Supports metric, imperial, and scientific units.",
      },

      {
        name: "Time Zone Converter",
        href: "/tools/timezone-converter",
        icon: GlobeIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Convert times between different time zones. View current times worldwide and convert specific dates and times. Perfect for scheduling and international communication.",
      },
      {
        name: "Calculator",
        href: "/tools/calculator",
        icon: CalculatorIcon,
        available: true,
        order: 4,
        creationDate: "2025-09-10",
        description:
          "Advanced calculator with basic, scientific, and graphing modes. Perform arithmetic operations, trigonometric functions, logarithms, memory operations, plot y = f(x) functions, and more. Full keyboard support included.",
      },
      {
        name: "Age Calculator",
        href: "/tools/age-calculator",
        icon: CalendarIcon,
        available: true,
        order: 5,
        creationDate: "2025-08-20",
        description:
          "Calculate your exact age in years, months, and days. Compare ages between two people and get detailed age information including zodiac signs and next birthday.",
      },
      {
        name: "Number Base Converter",
        href: "/tools/number-base-converter",
        icon: CalculatorIcon,
        available: true,
        order: 6,
        creationDate: "2025-09-10",
        description:
          "Convert between binary, octal, decimal and hexadecimal with live validation.",
      },
      {
        name: "Currency Converter",
        href: "/tools/currency-converter",
        icon: CoinsIcon,
        available: true,
        order: 8,
        creationDate: "2025-09-24",
        description:
          "Convert between all major currencies in the browser using cached daily rates and animated number display.",
        onDevice: false,
      },
      {
        name: "Loan Calculator",
        href: "/tools/loan-calculator",
        icon: CalculatorIcon,
        available: true,
        order: 9,
        creationDate: "2026-02-20",
        description:
          "Calculate monthly payments, total interest, and amortization schedules for mortgages and loans. Visualize payment breakdown with an interactive chart.",
      },
      {
        name: "Percentage Calculator",
        href: "/tools/percentage-calculator",
        icon: PercentIcon,
        available: true,
        order: 10,
        creationDate: "2026-02-20",
        description:
          "Calculate percentages, percentage change, percentage of a number, and reverse percentages. Multiple calculation modes for everyday math needs.",
      },
      {
        name: "Aspect Ratio Calculator",
        href: "/tools/aspect-ratio",
        icon: ScaleIcon,
        available: true,
        order: 11,
        creationDate: "2026-02-20",
        description:
          "Calculate and lock aspect ratios for images and videos. Find the missing dimension, compare ratios, and get pixel dimensions for common screen sizes.",
      },
      {
        name: "BMI Calculator",
        href: "/tools/bmi-calculator",
        icon: UserIcon,
        available: true,
        order: 12,
        creationDate: "2026-02-22",
        description:
          "Calculate Body Mass Index (BMI) in metric or imperial units. Shows BMI category, healthy weight range, and visual gauge.",
      },
      {
        name: "Tip Calculator",
        href: "/tools/tip-calculator",
        icon: ReceiptIcon,
        available: true,
        order: 13,
        creationDate: "2026-02-22",
        description:
          "Calculate tips and split bills between multiple people. Choose tip percentage or enter custom amount. Shows per-person totals.",
      },
      {
        name: "Roman Numeral Converter",
        href: "/tools/roman-numeral",
        icon: HashIcon,
        available: true,
        order: 14,
        creationDate: "2026-05-21",
        description:
          "Convert numbers to Roman numerals and Roman numerals back to numbers. Supports values from 1 to 3999 with a step-by-step breakdown and reference table.",
      },
    ],
  },
  {
    category: "Productivity Tools",
    id: "productivity",
    order: 8,
    items: [
      {
        name: "Mind Map Maker",
        href: "/tools/mind-map",
        icon: NetworkIcon,
        available: true,
        order: 10,
        creationDate: "2026-05-21",
        description:
          "Create interactive mind maps in your browser. Add child and sibling nodes, edit text inline, drag to reposition, connect ideas, and color-code branches. Export as JSON or PNG. Saves to your browser automatically.",
      },
      {
        name: "Signature Maker",
        href: "/tools/signature-maker",
        icon: SignatureIcon,
        available: true,
        order: 20,
        creationDate: "2026-05-21",
        description:
          "Create an online signature: draw it freehand with adjustable pen color and thickness, or type your name in a handwriting font. Export a transparent PNG or SVG. 100% client-side.",
      },
      {
        name: "Random Picker",
        href: "/tools/random-picker",
        icon: DicesIcon,
        available: true,
        order: 8,
        creationDate: "2026-05-21",
        description:
          "Generate random numbers, roll dice, flip a coin, or pick a random winner from a list. Set min/max ranges, allow or block duplicates, and spin a name wheel for giveaways. Cryptographically-decent randomness, all in your browser.",
      },
      {
        name: "Todo List",
        href: "/tools/todo",
        icon: CheckSquareIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Organize your tasks and stay productive. Create, manage, and track your todos with priority levels. Mark tasks as completed and keep your workflow organized.",
      },
      {
        name: "Timer & Countdown",
        href: "/tools/timer",
        icon: ClockIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Simple timer and countdown with fullscreen mode and completion sound. Perfect for work sessions, workouts, cooking, and presentations.",
      },
      {
        name: "Pomodoro Timer",
        href: "/tools/pomodoro",
        icon: TimerIcon,
        available: true,
        order: 3,
        creationDate: "2026-02-20",
        description:
          "Boost focus with the Pomodoro Technique. 25-minute work sessions with 5-minute short breaks and 15-minute long breaks. Tracks sessions and plays sounds.",
      },
      {
        name: "World Clock",
        href: "/tools/world-clock",
        icon: SunIcon,
        available: true,
        order: 4,
        creationDate: "2026-02-20",
        description:
          "View current time in multiple cities and time zones simultaneously. Add your favorite cities, compare times, and see which ones overlap during business hours.",
      },
      {
        name: "Stopwatch",
        href: "/tools/stopwatch",
        icon: TimerIcon,
        available: true,
        order: 5,
        creationDate: "2026-02-22",
        description:
          "Precise stopwatch with lap times and split tracking. Start, stop, reset, and record laps. Export lap history as CSV.",
      },
      {
        name: "Habit Tracker",
        href: "/tools/habit-tracker",
        icon: CheckSquareIcon,
        available: true,
        order: 6,
        creationDate: "2026-02-22",
        description:
          "Track daily habits and build streaks. Add custom habits, mark them complete each day, and view your streak and completion history. All stored locally.",
      },
      {
        name: "Keep Awake",
        href: "/tools/keep-awake",
        icon: ZapIcon,
        available: true,
        order: 7,
        creationDate: "2026-04-14",
        description:
          "Prevent your laptop or phone from sleeping. Choose a duration — 15 minutes, an hour, all day — or stay awake indefinitely. Uses the Screen Wake Lock API, works on Mac, Windows, Linux, iOS and Android. No install, no accounts.",
      },
    ],
  },
  {
    category: "Developer Tools",
    id: "devTools",
    order: 9,
    items: [
      {
        name: "UUID Generator",
        href: "/tools/uuid-generator",
        icon: KeyIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Generate Universally Unique Identifiers (UUIDs) in different versions and formats. Perfect for database keys, API identifiers, and unique references.",
      },
      {
        name: "Unix Timestamp Converter",
        href: "/tools/unix-timestamp",
        icon: ClockIcon,
        available: true,
        order: 2,
        creationDate: "2025-09-10",
        description: "Epoch seconds/milliseconds ↔ human date with timezone.",
      },
      {
        name: "Regex Tester",
        href: "/tools/regex-tester",
        icon: CodeIcon,
        available: true,
        order: 3,
        creationDate: "2025-09-10",
        description:
          "Test JavaScript regular expressions with live highlighting and flags.",
      },
      {
        name: "Cron Parser",
        href: "/tools/cron-parser",
        icon: CalendarClockIcon,
        available: true,
        order: 4,
        creationDate: "2025-09-10",
        description: "Explain cron expressions and list next runs.",
      },
      {
        name: "HTTP Status Codes",
        href: "/tools/http-status",
        icon: ServerIcon,
        available: true,
        order: 5,
        creationDate: "2026-02-20",
        description:
          "Quick reference for all HTTP status codes with descriptions, use cases, and examples. Search by code number or keyword. Covers 1xx through 5xx.",
      },
      {
        name: "CSS Minifier",
        href: "/tools/css-minifier",
        icon: ZapIcon,
        available: true,
        order: 6,
        creationDate: "2026-02-22",
        description:
          "Minify or beautify CSS code. Remove comments and whitespace for production, or prettify minified CSS for debugging. Shows size reduction percentage.",
      },
      {
        name: "SQL Formatter",
        href: "/tools/sql-formatter",
        icon: DatabaseIcon,
        available: true,
        order: 7,
        creationDate: "2026-02-22",
        description:
          "Format and beautify SQL queries with proper indentation and keyword casing. Supports SELECT, INSERT, UPDATE, DELETE, CREATE, and more.",
      },
      {
        name: "Chmod Calculator",
        href: "/tools/chmod",
        icon: LockIcon,
        available: true,
        order: 8,
        creationDate: "2026-03-05",
        description:
          "Calculate Unix file permissions visually. Toggle read/write/execute bits for owner, group, and others to get the octal value and chmod command.",
      },
      {
        name: "Meta Tags Generator",
        href: "/tools/meta-tags",
        icon: TagIcon,
        available: true,
        order: 9,
        creationDate: "2026-03-05",
        description:
          "Generate HTML meta tags, Open Graph tags, and Twitter Card tags. Preview how your page will appear in search results and social media.",
      },
      {
        name: "cURL Converter",
        href: "/tools/curl-converter",
        icon: TerminalIcon,
        available: true,
        order: 10,
        creationDate: "2026-05-21",
        description:
          "Convert a curl command into ready-to-run code for JavaScript fetch, Node.js, Python requests, Go, and PHP. Parses headers, query, auth, and body entirely in your browser.",
      },
      {
        name: "Code Formatter",
        href: "/tools/code-format",
        icon: CodeIcon,
        available: true,
        order: 11,
        creationDate: "2025-08-20",
        description:
          "Format and beautify your code with proper indentation and syntax highlighting. Supports JavaScript, Python, HTML, CSS, JSON, and many more languages.",
      },
      {
        name: "HTML Formatter",
        href: "/tools/html-formatter",
        icon: CodeIcon,
        available: true,
        order: 12,
        creationDate: "2026-02-20",
        description:
          "Format, prettify, or minify HTML code. Automatically indents tags, fixes nesting, and removes whitespace for production builds.",
      },
      {
        name: "JSON Formatter",
        href: "/tools/json-formatter",
        icon: BracesIcon,
        available: true,
        order: 13,
        creationDate: "2026-02-20",
        description:
          "Format, validate, and minify JSON. Pretty-print with syntax highlighting, detect errors, sort keys, and minify for production. Works entirely in your browser.",
      },
    ],
  },
  {
    category: "Security Tools",
    id: "securityTools",
    order: 11,
    items: [
      {
        name: "JWT Decoder",
        href: "/tools/jwt-decoder",
        icon: ShieldIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Decode and validate JSON Web Tokens (JWTs). View header, payload, and signature information with validation checks. Perfect for debugging and security analysis.",
      },
      {
        name: "Password Generator",
        href: "/tools/password-generator",
        icon: ShieldIcon,
        available: true,
        order: 2,
        creationDate: "2025-08-20",
        description:
          "Generate secure passwords with custom options including length, character types, and special requirements. Create strong passwords for accounts and applications.",
      },
      {
        name: "Hash Generator",
        href: "/tools/hash-generator",
        icon: HashIcon,
        available: true,
        order: 3,
        creationDate: "2025-08-20",
        description:
          "Generate cryptographic hashes from text input. Supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms. Perfect for data integrity and security.",
      },
      {
        name: "Password Strength",
        href: "/tools/password-strength",
        icon: ShieldIcon,
        available: true,
        order: 4,
        creationDate: "2026-02-20",
        description:
          "Analyze the strength of any password in real time. Checks entropy, character variety, common patterns, and dictionary words. All analysis runs locally.",
      },
      {
        name: "Text Encryption",
        href: "/tools/text-encryption",
        icon: LockIcon,
        available: true,
        order: 5,
        creationDate: "2026-02-20",
        description:
          "Encrypt and decrypt text using AES-256-GCM via the Web Crypto API. Your data never leaves the browser. Use a passphrase or generate a random key.",
      },
    ],
  },
  {
    category: "Design Tools",
    id: "designTools",
    order: 10,
    items: [
      {
        name: "CSS clip-path Generator",
        href: "/tools/clip-path-generator",
        icon: ScissorsIcon,
        available: true,
        order: 10,
        creationDate: "2026-05-21",
        description:
          "Visually create CSS clip-path shapes. Drag polygon vertices over a live preview, tune circle, ellipse, and rounded inset, then copy production-ready clip-path CSS with triangle, hexagon, star, and bubble presets.",
      },
      {
        name: "Cubic-Bezier Easing Editor",
        href: "/tools/cubic-bezier",
        icon: SplineIcon,
        available: true,
        order: 11,
        creationDate: "2026-05-21",
        description:
          "Design CSS easing curves with two draggable control handles, easing presets, numeric inputs, and a live animation preview. Copy the cubic-bezier() and transition-timing-function CSS.",
      },
      {
        name: "Glassmorphism Generator",
        href: "/tools/glassmorphism-generator",
        icon: LayersIcon,
        available: true,
        order: 12,
        creationDate: "2026-05-21",
        description:
          "Create frosted-glass (glassmorphism) CSS visually. Tune blur, transparency, tint, saturation, border, and radius with a live preview, then copy CSS with the -webkit- prefix and a fallback.",
      },
      {
        name: "SVG Blob Generator",
        href: "/tools/svg-blob-generator",
        icon: ShapesIcon,
        available: true,
        order: 13,
        creationDate: "2026-05-21",
        description:
          "Generate random organic blob shapes and smooth SVG wave dividers. Adjust complexity, randomness, size, and solid or gradient fill, then copy the SVG markup or download a .svg file.",
      },
      {
        name: "Code Screenshot",
        href: "/tools/code-screenshot",
        icon: CodeIcon,
        available: true,
        order: 20,
        creationDate: "2026-05-21",
        description:
          "Turn code into beautiful, shareable images. A free Carbon alternative with syntax highlighting, themes, gradient backgrounds, macOS window style, and PNG export.",
      },
      {
        name: "OG Image Generator",
        href: "/tools/og-image-generator",
        icon: ShareIcon,
        available: true,
        order: 21,
        creationDate: "2026-05-21",
        description:
          "Generate 1200x630 Open Graph and social-share images on a canvas. Pick a template, set title, subtitle, colors, and logo, then export a PNG plus ready-to-paste og:image meta tags.",
      },
      {
        name: "CSS Gradient Generator",
        href: "/tools/css-gradient",
        icon: SwatchBookIcon,
        available: true,
        order: 1,
        creationDate: "2026-02-20",
        description:
          "Create beautiful CSS gradients visually. Add color stops, control angles and positions, and copy the generated CSS. Supports linear, radial, and conic gradients.",
      },
      {
        name: "Color Palette Generator",
        href: "/tools/color-palette",
        icon: PaletteIcon,
        available: true,
        order: 2,
        creationDate: "2026-02-20",
        description:
          "Generate harmonious color palettes from a base color. Explore complementary, triadic, analogous, and split-complementary schemes. Export as CSS variables or JSON.",
      },
      {
        name: "Color Converter",
        href: "/tools/color-converter",
        icon: PaletteIcon,
        available: true,
        order: 3,
        creationDate: "2025-09-10",
        description: "Convert between HEX, RGB, and HSL with live preview.",
      },
      {
        name: "Color Contrast Checker",
        href: "/tools/contrast-checker",
        icon: Columns2Icon,
        available: true,
        order: 5,
        creationDate: "2026-02-22",
        description:
          "Check color contrast ratios for WCAG accessibility compliance. Enter foreground and background colors to get AA and AAA pass/fail results for normal and large text.",
      },
      {
        name: "Emoji Picker",
        href: "/tools/emoji-picker",
        icon: SmileIcon,
        available: true,
        order: 8,
        creationDate: "2026-02-22",
        description:
          "Browse and search all Unicode emojis by name or category. Click to copy to clipboard. Filter by skin tone and find emoji codes.",
      },
      {
        name: "CSS Box Shadow Generator",
        href: "/tools/css-shadow",
        icon: SquareIcon,
        available: true,
        order: 9,
        creationDate: "2026-03-05",
        description:
          "Build CSS box shadows visually with sliders for offset, blur, spread, color, and opacity. Supports multiple shadow layers.",
      },
      {
        name: "Image Color Picker",
        href: "/tools/image-color-picker",
        icon: PipetteIcon,
        available: true,
        order: 22,
        creationDate: "2026-05-21",
        description:
          "Pick any color from an image. Upload a photo and hover or click to get HEX, RGB, and HSL plus a dominant-color palette. 100% in-browser via canvas.",
      },
      {
        name: "Color Blindness Simulator",
        href: "/tools/color-blindness",
        icon: EyeIcon,
        available: true,
        order: 23,
        creationDate: "2026-02-22",
        description:
          "Simulate how images appear to people with different types of color blindness: deuteranopia, protanopia, tritanopia, and achromatopsia.",
      },
    ],
  },
  {
    category: "AI Tools",
    id: "aiTools",
    order: 2,
    items: [
      {
        name: "Audio/Video Transcriber",
        href: "/tools/audio-transcriber",
        icon: MicIcon,
        available: true,
        order: 31,
        creationDate: "2026-05-22",
        description:
          "Transcribe audio or video to text and generate SRT/VTT subtitles with on-device Whisper AI. Free, private, no upload.",
      },
      {
        name: "Text Summarizer",
        href: "/tools/text-summarizer",
        icon: TextQuoteIcon,
        available: true,
        order: 33,
        creationDate: "2026-05-22",
        description:
          "Summarize long text into a short summary with an on-device AI model. Choose short, medium, or long. Free, private, no upload.",
      },
      {
        name: "Translator",
        href: "/tools/translator",
        icon: LanguagesIcon,
        available: true,
        order: 34,
        creationDate: "2026-05-22",
        description:
          "Translate text between 15 languages fully on-device with an AI model. Free, private, offline-capable - no Google or DeepL.",
      },
      {
        name: "PII Detector & Redactor",
        href: "/tools/pii-redactor",
        icon: ShieldIcon,
        available: true,
        order: 36,
        creationDate: "2026-05-22",
        description:
          "Detect and redact personal info - names, emails, phone numbers, locations, credit cards, IPs - with an on-device AI model. Free, private, no upload.",
      },
      {
        name: "Zero-Shot Text Classifier",
        href: "/tools/zero-shot-classifier",
        icon: ListChecksIcon,
        available: true,
        order: 38,
        creationDate: "2026-05-22",
        description:
          "Classify any text into your own custom labels with an on-device AI model. No training needed. Free, private, no upload.",
      },
      {
        name: "Sentiment Analyzer",
        href: "/tools/sentiment-analyzer",
        icon: SmileIcon,
        available: true,
        order: 30,
        creationDate: "2026-05-22",
        description:
          "Detect positive or negative sentiment in text with an on-device AI model. Free, private, no upload.",
      },
      {
        name: "Token Counter",
        href: "/tools/token-counter",
        icon: BrainIcon,
        available: true,
        order: 1,
        creationDate: "2026-03-05",
        description:
          "Count tokens for any text across popular AI models: GPT-4o, Claude, Llama 3, and more. Instantly see token usage before sending to an API. No API key needed.",
      },
      {
        name: "Context Window Calculator",
        href: "/tools/context-window",
        icon: BrainIcon,
        available: true,
        order: 2,
        creationDate: "2026-03-05",
        description:
          "Calculate how much of a model's context window your text uses. See tokens used, percentage filled, tokens remaining, and estimated API cost for major models.",
      },
      {
        name: "AI Cost Calculator",
        href: "/tools/ai-cost-calculator",
        icon: BrainIcon,
        available: true,
        order: 3,
        creationDate: "2026-03-05",
        description:
          "Estimate your AI API costs by entering token counts and selecting a model. Supports GPT-4o, Claude 3.5, Gemini, Llama, and more with up-to-date pricing.",
      },
      {
        name: "Model Comparison",
        href: "/tools/model-comparison",
        icon: BrainIcon,
        available: true,
        order: 4,
        creationDate: "2026-03-05",
        description:
          "Compare AI language models side by side: context window size, pricing, capabilities, speed, and provider. Filter and sort to find the best model for your use case.",
      },
      {
        name: "System Prompt Builder",
        href: "/tools/system-prompt-builder",
        icon: BrainIcon,
        available: true,
        order: 5,
        creationDate: "2026-03-05",
        description:
          "Build structured system prompts for AI models using a guided form. Set role, tone, constraints, output format, and examples. Export as plain text or Claude XML tags.",
      },
      {
        name: "Prompt Library",
        href: "/tools/prompt-library",
        icon: BrainIcon,
        available: true,
        order: 6,
        creationDate: "2026-03-05",
        description:
          "Save, organize, and search your AI prompts locally in the browser. Tag prompts by category, copy with one click, and export or import your entire library as JSON.",
      },
      {
        name: "CLAUDE.md Generator",
        href: "/tools/claude-md-generator",
        icon: BrainIcon,
        available: true,
        order: 7,
        creationDate: "2026-03-05",
        description:
          "Generate CLAUDE.md files for your projects using a structured form. Define tech stack, conventions, commands, do/don't rules, and coding standards. Copy or download.",
      },
      {
        name: "AI Rules Generator",
        href: "/tools/ai-rules-generator",
        icon: BrainIcon,
        available: true,
        order: 8,
        creationDate: "2026-03-05",
        description:
          "Generate .cursorrules, .windsurfrules, and GitHub Copilot instruction files for your IDE. Fill in your stack and preferences, get a ready-to-use AI rules file.",
      },
      {
        name: "JSON Schema Builder",
        href: "/tools/json-schema-builder",
        icon: BrainIcon,
        available: true,
        order: 9,
        creationDate: "2026-03-05",
        description:
          "Build JSON schemas for LLM tool calls and function calling using a visual form. Outputs OpenAI and Anthropic tool format. Perfect for structured AI output definitions.",
      },
      {
        name: "MCP Config Generator",
        href: "/tools/mcp-config",
        icon: BrainIcon,
        available: true,
        order: 10,
        creationDate: "2026-03-05",
        description:
          "Generate Model Context Protocol (MCP) configuration files for Claude Desktop and other MCP clients. Add servers, configure transports, and export valid JSON config.",
      },
      {
        name: "Prompt Formatter",
        href: "/tools/prompt-formatter",
        icon: BrainIcon,
        available: true,
        order: 11,
        creationDate: "2026-03-05",
        description:
          "Convert prompts between different AI formats: ChatML, Llama 3 Instruct, Claude XML tags, and plain text. Preview the formatted output instantly.",
      },
      {
        name: "Skill / Agent Builder",
        href: "/tools/skill-builder",
        icon: BrainIcon,
        available: true,
        order: 12,
        creationDate: "2026-03-05",
        description:
          "Scaffold AI agent skill files with a guided form. Set name, description, trigger phrases, and instructions. Outputs a ready-to-use YAML/Markdown skill file.",
      },
      {
        name: "AI Instruction Diff",
        href: "/tools/ai-instruction-diff",
        icon: BrainIcon,
        available: true,
        order: 13,
        creationDate: "2026-03-05",
        description:
          "Compare two system prompts, CLAUDE.md files, or AI instruction sets side by side. Highlights additions, deletions, and changes to track prompt evolution.",
      },
      {
        name: "Text Similarity",
        href: "/tools/text-similarity",
        icon: BrainIcon,
        available: true,
        order: 14,
        creationDate: "2026-03-05",
        description:
          "Measure semantic similarity between texts using TF-IDF cosine similarity, all in the browser. Useful for comparing prompts, outputs, or any text pairs.",
      },
    ],
  },
  {
    category: "Tests & Games",
    id: "testsGames",
    order: 12,
    items: [
      {
        name: "Typing Test",
        href: "/tools/typing-test",
        icon: TypeIcon,
        available: true,
        order: 1,
        creationDate: "2025-09-01",
        description:
          "Measure your typing speed (WPM) and accuracy with optional mechanical keyboard click sounds.",
      },
      {
        name: "Keyboard Tester",
        href: "/tools/keyboard-tester",
        icon: KeyboardIcon,
        available: true,
        order: 2,
        creationDate: "2026-07-16",
        description:
          "Test every key on your keyboard with a live visual layout, key history, and rollover check.",
      },
      {
        name: "Gamepad Tester",
        href: "/tools/gamepad-tester",
        icon: Gamepad2Icon,
        available: true,
        order: 3,
        creationDate: "2026-07-16",
        description:
          "Test controller buttons, sticks, triggers, and vibration for any USB or Bluetooth gamepad.",
      },
    ],
  },
  {
    category: "School & Learning",
    id: "schoolLearning",
    order: 13,
    items: [
      {
        name: "Periodic Table",
        href: "/tools/periodic-table",
        icon: AtomIcon,
        available: true,
        order: 1,
        creationDate: "2026-05-21",
        description:
          "Interactive periodic table of all 118 elements in the standard layout. Color-coded by category, searchable by name, symbol, or atomic number. Click any element for atomic mass, group, period, and electron configuration.",
      },
      {
        name: "Wheel of Names",
        href: "/tools/wheel-of-names",
        icon: Disc3Icon,
        available: true,
        order: 2,
        creationDate: "2026-07-17",
        description:
          "Spin a customizable wheel to randomly pick a winner from a list of names. Paste one name per line, shuffle the order, and optionally remove each winner after they're picked.",
      },
      {
        name: "Random Group Maker",
        href: "/tools/group-maker",
        icon: UsersIcon,
        available: true,
        order: 3,
        creationDate: "2026-07-17",
        description:
          "Split a list of names into randomized groups. Choose a target number of groups or a group size, and get a print-friendly grid of balanced teams.",
      },
      {
        name: "Bingo Card Generator",
        href: "/tools/bingo-card-generator",
        icon: TicketIcon,
        available: true,
        order: 4,
        creationDate: "2026-07-17",
        description:
          "Generate classic B-I-N-G-O number cards or custom word-pool bingo cards, print as many as your class needs, and hand out a unique sheet to every student.",
      },
      // landingFor variant of Timer: a countdown preset for classroom use.
      // inGrid because it's a distinct search intent (Task 9).
      {
        name: "Classroom Timer",
        href: "/tools/classroom-timer",
        icon: Clock4Icon,
        available: true,
        order: 5,
        creationDate: "2026-07-17",
        description:
          "A full-screen countdown timer built for the classroom — set the minutes, hit start, and keep the whole room on track.",
        landingFor: "timer",
        inGrid: true,
      },
    ],
  },
  {
    category: "Business",
    id: "business",
    order: 14,
    items: [
      {
        name: "Invoice Generator",
        href: "/tools/invoice",
        icon: ReceiptIcon,
        available: true,
        order: 1,
        creationDate: "2025-08-20",
        description:
          "Create professional invoices with customizable templates, automatic tax calculations, and PDF export. Perfect for freelancers, small businesses, and contractors.",
      },
      {
        name: "Expense Tracker",
        href: "/tools/expense-tracker",
        icon: DollarSignIcon,
        available: true,
        order: 2,
        creationDate: "2025-09-11",
        description:
          "Track your expenses with detailed categorization, budget management, and comprehensive reports. Visualize spending patterns with interactive charts and export data for analysis.",
      },
    ],
  },
];

// Helper function to get all tools as a flat array
export const getAllTools = (): (Tool & { category: string })[] => {
  return tools.flatMap((category) =>
    category.items.map((tool) => ({ ...tool, category: category.category })),
  );
};

// A tool is hidden from the user-facing catalog surfaces (homepage grid,
// marketing count, command palette) when it is a `landingFor` variant that is
// NOT flagged `inGrid`. `inGrid` variants (e.g. the PDF operations) are distinct
// intents that surface as their own cards while still belonging to their
// canonical's family; plain SEO long-tail variants stay hidden. One predicate so
// the grid, the count, and the palette can never drift apart.
export const isHiddenVariant = (tool: Tool): boolean =>
  !!tool.landingFor && !tool.inGrid;

// Catalog tools — the public, user-facing set: every tool EXCEPT hidden SEO
// landing variants. This is what the homepage grid and the marketing "N+ tools"
// count show. `getAllTools()` stays the full set so sitemap / metadata / route +
// e2e generation keep every landing variant visible.
export const getCatalogTools = (): (Tool & { category: string })[] =>
  getAllTools().filter((tool) => !isHiddenVariant(tool));

// Related-tile resolution shared by the ToolShell (spec §3, zone 5). Pure so it
// can be unit-tested against a synthetic pool; defaults to the live catalog.
//   - NORMAL tool: up to `limit` same-category siblings, excluding itself AND
//     any landing variant (they never surface as a normal tool's related tile).
//   - LANDING tool (its own slug carries `landingFor`): the canonical tool
//     first, then sibling variants sharing the same `landingFor`, with the TOTAL
//     capped at `limit` so the tile count matches a normal tool's.
export const getRelatedTools = (
  slug: string,
  limit = 3,
  pool: (Tool & { category: string })[] = getAllTools(),
): { slug: string; href: string; icon: Tool["icon"]; creationDate: string }[] => {
  const slugOf = (t: { href: string }) => t.href.split("/").pop() as string;
  const toEntry = (t: Tool) => ({
    slug: slugOf(t),
    href: t.href,
    icon: t.icon,
    creationDate: t.creationDate,
  });
  const self = pool.find((t) => slugOf(t) === slug);
  if (!self) return [];

  if (self.landingFor) {
    const result: (Tool & { category: string })[] = [];
    const canonical = pool.find((t) => slugOf(t) === self.landingFor);
    if (canonical) result.push(canonical);
    for (const t of pool) {
      if (result.length >= limit) break;
      if (t.landingFor === self.landingFor && slugOf(t) !== slug && t.available) {
        result.push(t);
      }
    }
    return result.slice(0, limit).map(toEntry);
  }

  return pool
    .filter(
      (t) =>
        t.category === self.category &&
        t.available &&
        !t.landingFor &&
        slugOf(t) !== slug,
    )
    .slice(0, limit)
    .map(toEntry);
};

// Helper function to find a tool by href
export const findToolByHref = (
  href: string,
): (Tool & { category: string }) | null => {
  const allTools = getAllTools();
  return allTools.find((tool) => tool.href === href) || null;
};

// Helper function to check if a tool is new (15 days or less)
export const isToolNew = (creationDate: string): boolean => {
  const toolDate = new Date(creationDate);
  const currentDate = new Date();
  const diffTime = currentDate.getTime() - toolDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 15;
};

// Helper function to get days since creation
export const getDaysSinceCreation = (creationDate: string): number => {
  const toolDate = new Date(creationDate);
  const currentDate = new Date();
  const diffTime = currentDate.getTime() - toolDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/** Total tool count, rounded DOWN to the nearest ten — for "N+" marketing
    copy ("Search 130+ tools"), where an exact count with a plus ("137+")
    reads wrong. Exact counts without a plus should use the real number. */
export function roundedToolCount(): number {
  const exact = getCatalogTools().length;
  return Math.floor(exact / 10) * 10;
}
