"use client";

import { useState, useMemo } from "react";
import { searchTools } from "@/lib/search-utils";
import { Input } from "@/components/ui/input";
import { Search, Star, Clock } from "lucide-react";
import { getAllTools } from "@/lib/tools-config";
import { useFavoritesStore } from "@/store/favorites-store";
import { useRecentToolsStore } from "@/store/recent-tools-store";
import ToolCard from "@/components/ToolCard";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { getFavoriteTools } = useFavoritesStore();
  const { getRecentTools } = useRecentToolsStore();

  const allTools = getAllTools();
  const favoriteTools = getFavoriteTools(allTools);
  const recentTools = getRecentTools(allTools);

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
        <div className="space-y-8">
          {searchQuery ? (
            // Show search results
            filteredTools.length === 0 ? (
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
                    {category.items.map((tool) => (
                      <ToolCard
                        key={tool.name}
                        tool={{ ...tool, category: category.category }}
                      />
                    ))}
                  </div>
                </div>
              ))
            )
          ) : (
            // Show default layout with favorites and recent tools
            <>
              {/* Favorite Tools Section */}
              {favoriteTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-2xl font-semibold text-left">
                      Favorite Tools
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {favoriteTools.map((tool) => (
                      <ToolCard key={tool.name} tool={tool} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Tools Section */}
              {recentTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-2xl font-semibold text-left">
                      Recently Visited
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {recentTools.map((tool) => (
                      <ToolCard key={tool.name} tool={tool} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Tools Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-left">
                  All Tools
                </h2>
                <div className="space-y-8">
                  {filteredTools.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-xl font-medium mb-4 text-left text-muted-foreground">
                        {category.category}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {category.items.map((tool) => (
                          <ToolCard
                            key={tool.name}
                            tool={{ ...tool, category: category.category }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
