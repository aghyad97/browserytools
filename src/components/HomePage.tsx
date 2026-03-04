"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { searchTools } from "@/lib/search-utils";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List, Sparkles, X } from "lucide-react";
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
  const t = useTranslations("Tools.HomePage");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const { viewMode, setViewMode } = usePreferencesStore();
  const { getFavoriteTools } = useFavoritesStore();
  const { getRecentTools } = useRecentToolsStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isClient, setIsClient] = useState(false);
  const [showNewBanner, setShowNewBanner] = useState(false);

  // Count tools added in the last 60 days
  const newToolsCount = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 60);
    return getAllTools().filter(
      (t) => t.available && new Date(t.creationDate) >= cutoff
    ).length;
  }, []);

  // Ensure SSR and first client render match to avoid hydration issues with persisted stores
  useEffect(() => {
    setIsClient(true);
    // Show new-tools banner if there are new tools since last dismissal
    if (newToolsCount > 0) {
      const dismissed = localStorage.getItem("new-tools-banner-count");
      if (dismissed !== String(newToolsCount)) {
        setShowNewBanner(true);
      }
    }
  }, [newToolsCount]);

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

        {/* New Tools Announcement Banner */}
        {showNewBanner && newToolsCount > 0 && (
          <div className="mb-5 flex items-center justify-center">
            <div className="relative flex items-center gap-3 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 px-5 py-2 text-sm shadow-sm">
              <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />
              <span className="inline-flex items-center gap-1.5">
                <span className="rounded-full bg-violet-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {tCommon("new")}
                </span>
                <span className="font-medium text-foreground">
                  {newToolsCount} {t("newToolsAdded")}
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  {t("exploreBelow")}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(
                    "new-tools-banner-count",
                    String(newToolsCount)
                  );
                  setShowNewBanner(false);
                }}
                className="ml-1 rounded-full p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("dismiss")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <p className="text-2xl text-center text-muted-foreground">
            {allTools.filter((tool) => tool.available).length} {t("toolCountSuffix")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10 w-full"
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
                title={t("gridView")}
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
                title={t("listView")}
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
              { key: "All", label: t("allCategory"), id: "All" },
              ...allCategories
                .sort((a, b) => a.order - b.order)
                .map((c) => ({
                  key: c.category,
                  label: tc(`categories.${c.id}` as any),
                  id: c.id,
                })),
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                aria-pressed={selectedCategory === key}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors whitespace-nowrap ${
                  selectedCategory === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-muted border-input"
                }`}
              >
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    selectedCategory === key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {getToolCount(key)}
                </span>
                <span>{label}</span>
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
                  {t("noResultsPrefix")} "{searchQuery}"
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
                    <h2 className="text-2xl font-semibold mb-6 text-start">
                      {tc(`categories.${category.id}` as any)}
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
                    <h3 className="text-xl font-medium mb-2 text-start text-muted-foreground">
                      {t("favoriteTools")}
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
                    <h3 className="text-xl font-medium mb-2 text-start text-muted-foreground">
                      {t("recentlyUsed")}
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
                        <h3 className="text-xl font-medium mb-4 text-start text-muted-foreground">
                          {tc(`categories.${category.id}` as any)}
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
