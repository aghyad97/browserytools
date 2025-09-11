"use client";

import { useState, useMemo, useEffect } from "react";
import { searchTools } from "@/lib/search-utils";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List } from "lucide-react";
import { getAllTools, tools as allCategories } from "@/lib/tools-config";
import { useFavoritesStore } from "@/store/favorites-store";
import { useRecentToolsStore } from "@/store/recent-tools-store";
import ToolCard from "@/components/ToolCard";
import { usePreferencesStore } from "@/store/preferences-store";
import HomeFAQ from "@/components/HomeFAQ";
import GitHubStarBanner from "@/components/GitHubStarBanner";

interface HomePageProps {
  initialSearchQuery?: string;
}

export default function HomePage({ initialSearchQuery = "" }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const { viewMode, setViewMode } = usePreferencesStore();
  const { getFavoriteTools } = useFavoritesStore();
  const { getRecentTools } = useRecentToolsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isClient, setIsClient] = useState(false);

  // Ensure SSR and first client render match to avoid hydration issues with persisted stores
  useEffect(() => {
    setIsClient(true);
  }, []);

  const allTools = getAllTools();
  const favoriteTools = getFavoriteTools(allTools);
  const recentTools = getRecentTools(allTools);

  // Function to count available tools per category
  const getToolCount = (categoryName: string): number => {
    if (categoryName === "All") {
      return allTools.filter((tool) => tool.available).length;
    }
    const category = allCategories.find((cat) => cat.category === categoryName);
    return category
      ? category.items.filter((tool) => tool.available).length
      : 0;
  };

  // Enhanced search with fuzzy matching and scoring
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery);
  }, [searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <GitHubStarBanner />
        <div className="mb-8">
          <p className="text-2xl text-center text-muted-foreground">
            {allTools.filter((tool) => tool.available).length} Productivity
            browser-based tools. No servers. Full privacy. Open-source.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tools by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div
              className="hidden sm:flex items-center gap-1"
              aria-label="View mode"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-muted border-input"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-muted border-input"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {[
              "All",
              ...allCategories
                .sort((a, b) => a.order - b.order)
                .map((c) => c.category),
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-muted border-input"
                }`}
              >
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getToolCount(cat)}
                </span>
                <span>{cat}</span>
              </button>
            ))}
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
              filteredTools
                .filter((category) =>
                  selectedCategory === "All"
                    ? true
                    : category.category === selectedCategory
                )
                .map((category) => (
                  <div key={category.category}>
                    <h2 className="text-2xl font-semibold mb-6 text-left">
                      {category.category}
                    </h2>
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {category.items.map((tool) => (
                          <ToolCard
                            key={tool.name}
                            variant="grid"
                            tool={{ ...tool, category: category.category }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {category.items.map((tool) => (
                          <ToolCard
                            key={tool.name}
                            variant="list"
                            tool={{ ...tool, category: category.category }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
            )
          ) : (
            // Show default layout with favorites and recent tools
            <>
              {/* Favorite Tools Section */}
              {isClient && favoriteTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-medium mb-2 text-left text-muted-foreground">
                      Favorite Tools
                    </h3>
                  </div>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {favoriteTools.map((tool) => (
                        <ToolCard
                          key={tool.name}
                          variant="compact"
                          tool={tool}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {favoriteTools.map((tool) => (
                        <ToolCard key={tool.name} variant="list" tool={tool} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recent Tools Section */}
              {isClient && recentTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-medium mb-2 text-left text-muted-foreground">
                      Recently Used
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {recentTools.map((tool) => (
                      <ToolCard key={tool.name} variant="compact" tool={tool} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Tools Section */}
              <div>
                <div className="space-y-8">
                  {filteredTools
                    .filter((category) =>
                      selectedCategory === "All"
                        ? true
                        : category.category === selectedCategory
                    )
                    .map((category) => (
                      <div key={category.category}>
                        <h3 className="text-xl font-medium mb-4 text-left text-muted-foreground">
                          {category.category}
                        </h3>
                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {category.items.map((tool) => (
                              <ToolCard
                                key={tool.name}
                                variant="grid"
                                tool={{ ...tool, category: category.category }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {category.items.map((tool) => (
                              <ToolCard
                                key={tool.name}
                                variant="list"
                                tool={{ ...tool, category: category.category }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <HomeFAQ />
    </div>
  );
}
