import {
  BookMinusIcon,
  FileDownIcon,
  HammerIcon,
  ImagesIcon,
  SquarePlayIcon,
  FileIcon,
  CodeIcon,
  VideoIcon,
  FileTextIcon,
  Grid3X3Icon,
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
  BarChart3Icon,
  BarcodeIcon,
  CheckSquareIcon,
  ClockIcon,
} from "lucide-react";

export interface Tool {
  name: string;
  href: string;
  icon: any;
  available: boolean;
  description: string;
  order: number;
}

export interface ToolCategory {
  category: string;
  items: Tool[];
  order: number;
}

export const tools: ToolCategory[] = [
  {
    category: "Image Tools",
    order: 1,
    items: [
      {
        name: "Background Removal",
        href: "/tools/bg-removal",
        icon: ImagesIcon,
        available: true,
        order: 1,
        description:
          "Remove background from your images instantly using AI. Perfect for product photos, portraits, and graphics. Supports PNG, JPG, and other formats. No watermark, completely free.",
      },
      {
        name: "Phone Mockups",
        href: "/tools/phone-mockups",
        icon: SmartphoneIcon,
        available: false,
        order: 2,
        description:
          "Place screenshots into iPhone/Android device frames. Upload a screenshot, choose a frame, adjust fit, background, and export.",
      },
      {
        name: "Image Compression",
        href: "/tools/image-compression",
        icon: FileDownIcon,
        available: true,
        order: 3,
        description:
          "Compress images to reduce file size while maintaining quality. Perfect for web optimization, email attachments, and storage. Supports JPG, PNG, and WebP.",
      },
      {
        name: "Format Converter",
        href: "/tools/image-converter",
        icon: HammerIcon,
        available: true,
        order: 4,
        description:
          "Convert images between different formats like JPG, PNG, WebP, GIF, BMP, TIFF, and SVG. Batch conversion supported. Optimize for web or print.",
      },
      {
        name: "Color Correction",
        href: "/tools/color-correction",
        icon: PaintRollerIcon,
        available: true,
        order: 5,
        description:
          "Adjust colors, brightness, contrast, saturation, and hue in images. Enhance photos, fix lighting issues, and create artistic effects. Works with all image formats.",
      },
      {
        name: "SVG Tools",
        href: "/tools/svg",
        icon: FileImageIcon,
        available: false,
        order: 6,
        description:
          "Edit and manipulate SVG vector graphics. Scale, modify colors, optimize paths, and convert to other formats. Ideal for logos, icons, and scalable graphics.",
      },
    ],
  },
  {
    category: "File Tools",
    order: 2,
    items: [
      {
        name: "PDF Tools",
        href: "/tools/pdf",
        icon: FileTextIcon,
        available: true,
        order: 1,
        description:
          "Merge, split, compress, and manipulate PDF files. Extract text, rotate pages, add watermarks, and convert to other formats. No file size limits.",
      },
      {
        name: "Zip Tools",
        href: "/tools/zip",
        icon: FileArchiveIcon,
        available: true,
        order: 2,
        description:
          "Create, extract, and manage ZIP archives. Compress files and folders, extract archives, and browse contents. Supports password protection and encryption.",
      },
      {
        name: "CSV/Excel Viewer",
        href: "/tools/spreadsheet",
        icon: Grid3X3Icon,
        available: true,
        order: 3,
        description:
          "View and edit CSV and Excel files in your browser. Sort, filter, and analyze data. Export to different formats. No software installation required.",
      },
      {
        name: "File Converter",
        href: "/tools/file-converter",
        icon: FileIcon,
        available: true,
        order: 4,
        description:
          "Convert files between different formats including documents, images, audio, and video. Supports hundreds of file types with high-quality conversion.",
      },
    ],
  },

  {
    category: "Media Tools",
    order: 3,
    items: [
      {
        name: "Video Editor",
        href: "/tools/video",
        icon: VideoIcon,
        available: true,
        order: 1,
        description:
          "Trim, convert, and edit video files. Cut clips, merge videos, adjust quality, and convert between formats. Works with MP4, AVI, MOV, and more.",
      },
      {
        name: "Audio Editor",
        href: "/tools/audio",
        icon: SquarePlayIcon,
        available: true,
        order: 2,
        description:
          "Edit and process audio files. Trim, merge, convert formats, adjust volume, and apply effects. Supports MP3, WAV, FLAC, and other audio formats.",
      },
      // {
      //   name: "Compress Video",
      //   href: "/tools/compress-video",
      //   icon: FileDownIcon,
      //   available: false,
      //   order: 3,
      //   description:
      //     "Compress videos in your browser using ffmpeg.wasm. Control quality (CRF), presets, and resolution. No uploads; runs entirely on-device.",
      // },
    ],
  },
  {
    category: "Text & Language Tools",
    order: 4,
    items: [
      {
        name: "Text Case Converter",
        href: "/tools/text-case",
        icon: TypeIcon,
        available: true,
        order: 1,
        description:
          "Convert text between different cases: uppercase, lowercase, title case, camelCase, snake_case, and more. Perfect for coding and content formatting.",
      },
      {
        name: "Text Counter",
        href: "/tools/text-counter",
        icon: HashIcon,
        available: true,
        order: 2,
        description:
          "Count words, characters, lines, and paragraphs in text. Analyze readability, estimate reading time, and get detailed statistics for content analysis.",
      },
      {
        name: "Code Formatter",
        href: "/tools/code-format",
        icon: CodeIcon,
        available: true,
        order: 3,
        description:
          "Format and beautify your code with proper indentation and syntax highlighting. Supports JavaScript, Python, HTML, CSS, JSON, and many more languages.",
      },
      {
        name: "Rich Editor",
        href: "/tools/rich-editor",
        icon: BookMinusIcon,
        available: true,
        order: 4,
        description:
          "Edit and preview rich text documents with formatting options. Create documents with bold, italic, lists, links, and more. Export to HTML or Markdown.",
      },
      {
        name: "Lorem Ipsum Generator",
        href: "/tools/lorem-ipsum",
        icon: FileTextIcon,
        available: true,
        order: 5,
        description:
          "Generate placeholder text for designs and mockups. Customize length, paragraphs, and format. Perfect for web design, presentations, and prototyping.",
      },
      {
        name: "Typing Test",
        href: "/tools/typing-test",
        icon: TypeIcon,
        available: true,
        order: 6,
        description:
          "Measure your typing speed (WPM) and accuracy with optional mechanical keyboard click sounds.",
      },
    ],
  },
  {
    category: "Data Tools",
    order: 5,
    items: [
      {
        name: "JSON to CSV",
        href: "/tools/json-csv",
        icon: DatabaseIcon,
        available: true,
        order: 1,
        description:
          "Convert JSON data to CSV format for spreadsheet applications. Handle nested objects, arrays, and complex data structures. Perfect for data analysis and reporting.",
      },
      {
        name: "Base64 Tools",
        href: "/tools/base64",
        icon: DatabaseIcon,
        available: true,
        order: 2,
        description:
          "Encode or decode Base64 strings and files. Convert images, documents, and binary data to text format. Essential for web development and data transmission.",
      },
      {
        name: "QR Code Generator",
        href: "/tools/qr-generator",
        icon: QrCodeIcon,
        available: true,
        order: 3,
        description:
          "Generate QR codes from text, URLs, contact information, and more. Customize colors, size, and error correction. Download as PNG, SVG, or PDF.",
      },
      {
        name: "Barcode Generator",
        href: "/tools/barcode-generator",
        icon: BarcodeIcon,
        available: true,
        order: 4,
        description:
          "Generate various barcode types including CODE128, EAN-13, UPC-A, CODE39, and more. Customize appearance and download as PNG. Perfect for inventory, retail, and logistics.",
      },
    ],
  },
  {
    category: "Math & Finance Tools",
    order: 6,
    items: [
      {
        name: "Invoice Generator",
        href: "/tools/invoice",
        icon: ReceiptIcon,
        available: true,
        order: 1,
        description:
          "Create professional invoices with customizable templates, automatic tax calculations, and PDF export. Perfect for freelancers, small businesses, and contractors.",
      },
      {
        name: "Unit Converter",
        href: "/tools/unit-converter",
        icon: CalculatorIcon,
        available: true,
        order: 2,
        description:
          "Convert between different units of measurement including length, weight, temperature, area, volume, and more. Supports metric, imperial, and scientific units.",
      },
      {
        name: "Password Generator",
        href: "/tools/password-generator",
        icon: ShieldIcon,
        available: true,
        order: 3,
        description:
          "Generate secure passwords with custom options including length, character types, and special requirements. Create strong passwords for accounts and applications.",
      },
    ],
  },
  {
    category: "Productivity Tools",
    order: 7,
    items: [
      {
        name: "Todo List",
        href: "/tools/todo",
        icon: CheckSquareIcon,
        available: true,
        order: 1,
        description:
          "Organize your tasks and stay productive. Create, manage, and track your todos with priority levels. Mark tasks as completed and keep your workflow organized.",
      },
      {
        name: "Timer & Countdown",
        href: "/tools/timer",
        icon: ClockIcon,
        available: true,
        order: 2,
        description:
          "Simple timer and countdown with fullscreen mode and completion sound. Perfect for work sessions, workouts, cooking, and presentations.",
      },
    ],
  },
];

// Helper function to get all tools as a flat array
export const getAllTools = (): (Tool & { category: string })[] => {
  return tools.flatMap((category) =>
    category.items.map((tool) => ({ ...tool, category: category.category }))
  );
};

// Helper function to find a tool by href
export const findToolByHref = (
  href: string
): (Tool & { category: string }) | null => {
  const allTools = getAllTools();
  return allTools.find((tool) => tool.href === href) || null;
};
