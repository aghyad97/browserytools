"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { searchTools } from "@/lib/search-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced search with fuzzy matching and scoring
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery);
  }, [searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-4">
          <p className="text-lg text-muted-foreground">
            Essential browser-based tools for productivity. No servers. Full
            privacy.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search tools by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <TooltipProvider>
          <div className="space-y-8">
            {filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No tools found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              filteredTools.map((category) => (
                <div key={category.category}>
                  <h2 className="text-2xl font-semibold mb-6 text-left">
                    {category.category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {category.items.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <Tooltip key={tool.name}>
                          <TooltipTrigger asChild>
                            <Link
                              href={tool.available ? tool.href : "#"}
                              className={`block ${
                                tool.available ? "group" : "cursor-not-allowed"
                              }`}
                            >
                              <Card
                                className={`h-full transition-all shadow-none duration-200 relative ${
                                  tool.available
                                    ? "hover:shadow-md hover:scale-105 cursor-pointer"
                                    : "opacity-50"
                                }`}
                              >
                                {/* Status Badge - Overlapping Top Right Corner */}
                                <div className="absolute top-0.5 right-1 z-10">
                                  {tool.available ? (
                                    <div></div>
                                  ) : (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs shadow-sm rounded-xl"
                                    >
                                      Soon
                                    </Badge>
                                  )}
                                </div>

                                <CardContent className="p-4">
                                  <div className="flex flex-col items-center text-center space-y-3">
                                    {/* Icon */}
                                    <div className="p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors duration-200">
                                      <IconComponent className="w-6 h-6" />
                                    </div>

                                    {/* Tool Name */}
                                    <div className="space-y-2">
                                      <h3 className="font-medium text-sm leading-tight">
                                        {tool.name}
                                      </h3>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm">{tool.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
