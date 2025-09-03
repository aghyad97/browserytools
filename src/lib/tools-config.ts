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
} from "lucide-react";

export interface Tool {
  name: string;
  href: string;
  icon: any;
  available: boolean;
  description: string;
}

export interface ToolCategory {
  category: string;
  items: Tool[];
}

export const tools: ToolCategory[] = [
  {
    category: "Image Tools",
    items: [
      {
        name: "Background Removal",
        href: "/tools/bg-removal",
        icon: ImagesIcon,
        available: true,
        description: "Remove background from your images instantly",
      },
      {
        name: "Color Correction",
        href: "/tools/color-correction",
        icon: PaintRollerIcon,
        available: true,
        description: "Adjust colors, brightness, and contrast in images",
      },
      {
        name: "Format Converter",
        href: "/tools/image-converter",
        icon: HammerIcon,
        available: true,
        description: "Convert images between different formats",
      },
      {
        name: "Image Compression",
        href: "/tools/image-compression",
        icon: FileDownIcon,
        available: true,
        description: "Compress images to reduce file size",
      },
      {
        name: "SVG Tools",
        href: "/tools/svg",
        icon: FileImageIcon,
        available: false,
        description: "Edit and manipulate SVG files",
      },
    ],
  },
  {
    category: "File Tools",
    items: [
      {
        name: "PDF Tools",
        href: "/tools/pdf",
        icon: FileTextIcon,
        available: true,
        description: "Merge, split, and manipulate PDF files",
      },
      {
        name: "Zip Tools",
        href: "/tools/zip",
        icon: FileArchiveIcon,
        available: true,
        description: "Create, extract, and manage ZIP archives",
      },
      {
        name: "CSV/Excel Viewer",
        href: "/tools/spreadsheet",
        icon: Grid3X3Icon,
        available: true,
        description: "View and edit CSV and Excel files",
      },
      {
        name: "File Converter",
        href: "/tools/file-converter",
        icon: FileIcon,
        available: true,
        description: "Convert files between different formats",
      },
    ],
  },

  {
    category: "Media Tools",
    items: [
      {
        name: "Audio Editor",
        href: "/tools/audio",
        icon: SquarePlayIcon,
        available: true,
        description: "Edit and process audio files",
      },
      {
        name: "Video Editor",
        href: "/tools/video",
        icon: VideoIcon,
        available: true,
        description: "Trim, convert, and edit video files",
      },
    ],
  },
  {
    category: "Text & Language Tools",
    items: [
      {
        name: "Text Case Converter",
        href: "/tools/text-case",
        icon: TypeIcon,
        available: true,
        description: "Convert text between different cases",
      },
      {
        name: "Text Counter",
        href: "/tools/text-counter",
        icon: HashIcon,
        available: true,
        description: "Count words, characters, lines, and paragraphs",
      },
      {
        name: "Code Formatter",
        href: "/tools/code-format",
        icon: CodeIcon,
        available: true,
        description: "Format and beautify your code",
      },
      {
        name: "Rich Editor",
        href: "/tools/rich-editor",
        icon: BookMinusIcon,
        available: true,
        description: "Edit and preview rich text documents",
      },
      {
        name: "Lorem Ipsum Generator",
        href: "/tools/lorem-ipsum",
        icon: FileTextIcon,
        available: true,
        description: "Generate placeholder text for designs",
      },
    ],
  },
  {
    category: "Data Tools",
    items: [
      {
        name: "JSON to CSV",
        href: "/tools/json-csv",
        icon: DatabaseIcon,
        available: true,
        description: "Convert JSON data to CSV format",
      },
      {
        name: "Base64 Tools",
        href: "/tools/base64",
        icon: DatabaseIcon,
        available: true,
        description: "Encode or decode Base64 strings and files",
      },
      {
        name: "QR Code Generator",
        href: "/tools/qr-generator",
        icon: QrCodeIcon,
        available: true,
        description: "Generate QR codes from text and URLs",
      },
    ],
  },
  {
    category: "Utility Tools",
    items: [
      {
        name: "Unit Converter",
        href: "/tools/unit-converter",
        icon: CalculatorIcon,
        available: true,
        description: "Convert between different units of measurement",
      },
      {
        name: "Password Generator",
        href: "/tools/password-generator",
        icon: ShieldIcon,
        available: true,
        description: "Generate secure passwords with custom options",
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
