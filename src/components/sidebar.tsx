"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useToolStore } from "@/store/tool-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookMinusIcon,
  FileDownIcon,
  HammerIcon,
  ImagesIcon,
  Search,
  SquarePlayIcon,
  TypeIcon,
  HashIcon,
  FileTextIcon,
  QrCodeIcon,
  CalculatorIcon,
  ShieldIcon,
} from "lucide-react";
import {
  CodeIcon,
  VideoIcon,
  Grid3X3Icon,
  PaintRollerIcon,
  DatabaseIcon,
  FileArchiveIcon,
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

export default function Sidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const { setCurrentTool } = useToolStore();

  // Set current tool based on pathname
  useEffect(() => {
    const allTools = tools.flatMap((category) => category.items);
    const currentTool = allTools.find((tool) => tool.href === pathname);

    if (currentTool) {
      setCurrentTool({
        name: currentTool.name,
        href: currentTool.href,
        description: currentTool.description,
        category:
          tools.find((cat) => cat.items.includes(currentTool))?.category || "",
      });
    } else {
      setCurrentTool(null);
    }
  }, [pathname, setCurrentTool]);

  const filteredTools = tools
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (tool) =>
          tool.name.toLowerCase().includes(search.toLowerCase()) ||
          category.category.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="w-64 h-screen border-r flex flex-col">
      {/* Header */}
      <div className="mt-4 flex items-center">
        <Link href="/" className="flex items-center space-x-2 px-4">
          <span className="font-bold text-xl">BrowseryTools</span>
        </Link>
      </div>

      <div className="p-4 relative">
        <Search className="w-4 h-4 absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" />
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Scrollable tools list */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-6 p-2">
          {filteredTools.map((category) => (
            <div key={category.category}>
              <h3 className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                {category.category}
              </h3>
              <div className="space-y-1">
                {category.items.map((tool) => (
                  <TooltipProvider key={tool.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={tool.available ? tool.href : "#"}
                          className={cn(
                            "flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-accent",
                            "text-sm transition-colors duration-150",
                            pathname === tool.href && "bg-accent",
                            !tool.available && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <tool.icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{tool.name}</span>
                        </Link>
                      </TooltipTrigger>
                      {!tool.available && (
                        <TooltipContent>
                          <p>Coming Soon</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
