"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import {
  ImageIcon,
  FileIcon,
  CodeIcon,
  VideoIcon,
  FileTextIcon,
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
      },
      {
        name: "Color Correction",
        href: "/tools/color-correction",
        icon: PaintRollerIcon,
        available: true,
      },
      {
        name: "Format Converter",
        href: "/tools/image-converter",
        icon: HammerIcon,
        available: true,
      },
      {
        name: "Image Compression",
        href: "/tools/image-compression",
        icon: FileDownIcon,
        available: true,
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
      },
      {
        name: "Zip Tools",
        href: "/tools/zip",
        icon: FileArchiveIcon,
        available: true,
      },
      {
        name: "CSV/Excel Viewer",
        href: "/tools/spreadsheet",
        icon: Grid3X3Icon,
        available: true,
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
      },
      {
        name: "Markdown Editor",
        href: "/tools/markdown",
        icon: BookMinusIcon,
        available: false,
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
      },
      {
        name: "Video Trimmer",
        href: "/tools/video",
        icon: VideoIcon,
        available: true,
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
      },
      {
        name: "Base64 Tools",
        href: "/tools/base64",
        icon: DatabaseIcon,
        available: true,
      },
      {
        name: "Data Visualizer",
        href: "/tools/visualizer",
        icon: DatabaseIcon,
        available: true,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

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
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center space-x-2 mb-4">
          <span className="font-bold text-xl">Web Tools</span>
        </Link>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
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
