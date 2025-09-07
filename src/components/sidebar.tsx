"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
import { findToolByHref } from "@/lib/tools-config";
import { searchTools } from "@/lib/search-utils";
import Logo from "./logo";

export default function Sidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const { setCurrentTool } = useToolStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const activeToolRef = useRef<HTMLAnchorElement>(null);

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

  // Enhanced search with fuzzy matching and scoring
  const filteredTools = useMemo(() => {
    return searchTools(search);
  }, [search]);

  // Auto-scroll to active tool
  useEffect(() => {
    if (activeToolRef.current && scrollAreaRef.current && !search) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        const activeElement = activeToolRef.current;
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();

        // Calculate if element is visible in the scroll container
        const isVisible =
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom;

        if (!isVisible) {
          // Calculate the scroll position to center the active tool
          const scrollTop = scrollContainer.scrollTop;
          const containerHeight = containerRect.height;
          const elementTop = elementRect.top - containerRect.top + scrollTop;
          const elementHeight = elementRect.height;

          // Center the element in the viewport
          const targetScrollTop =
            elementTop - containerHeight / 2 + elementHeight / 2;

          scrollContainer.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: "smooth",
          });
        }
      }
    }
  }, [pathname, search, filteredTools]);

  return (
    <div className="w-full lg:w-64 h-full flex flex-col border-r">
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
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-2">
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
                          ref={
                            pathname === tool.href ? activeToolRef : undefined
                          }
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
