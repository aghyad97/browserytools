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
import { Search } from "lucide-react";
import { tools, findToolByHref } from "@/lib/tools-config";
import Logo from "./logo";

export default function Sidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const { setCurrentTool } = useToolStore();

  // Set current tool based on pathname
  useEffect(() => {
    const currentTool = findToolByHref(pathname);

    if (currentTool) {
      setCurrentTool({
        name: currentTool.name,
        href: currentTool.href,
        description: currentTool.description,
        category: currentTool.category,
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
          <Logo />
          <span className="font-semibold text-xl">BrowseryTools</span>
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
