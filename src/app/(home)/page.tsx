import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BookMinusIcon,
  FileDownIcon,
  HammerIcon,
  ImagesIcon,
  SquarePlayIcon,
  ImageIcon,
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

const tools = [
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
        available: true,
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
    category: "Code Tools",
    items: [
      {
        name: "Code Formatter",
        href: "/tools/code-format",
        icon: CodeIcon,
        available: true,
        description: "Format and beautify your code",
      },
      {
        name: "Markdown Editor",
        href: "/tools/markdown",
        icon: BookMinusIcon,
        available: false,
        description: "Edit and preview Markdown documents",
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
        name: "Video Trimmer",
        href: "/tools/video",
        icon: VideoIcon,
        available: true,
        description: "Trim and edit video files",
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
      {
        name: "Data Visualizer",
        href: "/tools/visualizer",
        icon: DatabaseIcon,
        available: true,
        description: "Visualize data with charts and graphs",
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

// Simple Badge component
const Badge = ({
  children,
  variant = "secondary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "secondary" | "outline";
  className?: string;
}) => {
  const variantClasses = {
    secondary: "bg-muted text-muted-foreground",
    outline: "border border-border text-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default function Home() {
  const allTools = tools.flatMap((category) =>
    category.items.map((tool) => ({ ...tool, category: category.category }))
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            BrowseryTools
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Essential browser-based tools for productivity. No servers. No Ads.
            Full privacy.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.name}
                href={tool.available ? tool.href : "#"}
                className={tool.available ? "group" : "cursor-not-allowed"}
              >
                <Card
                  className={`h-full transition-all duration-200 ${
                    tool.available
                      ? "hover:shadow-md cursor-pointer"
                      : "opacity-50"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-md bg-muted">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                    {!tool.available && (
                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          Coming Soon
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
