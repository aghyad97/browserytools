import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tool } from "@/lib/tools-config";

interface RecentTool {
  href: string;
  visitedAt: number;
}

interface RecentToolsStore {
  recentTools: RecentTool[];
  addRecentTool: (toolHref: string) => void;
  getRecentTools: (
    allTools: (Tool & { category: string })[]
  ) => (Tool & { category: string })[];
  clearRecentTools: () => void;
  maxRecentTools: number;
}

export const useRecentToolsStore = create<RecentToolsStore>()(
  persist(
    (set, get) => ({
      recentTools: [],
      maxRecentTools: 5,
      addRecentTool: (toolHref) =>
        set((state) => {
          const now = Date.now();
          const existingIndex = state.recentTools.findIndex(
            (tool) => tool.href === toolHref
          );

          let newRecentTools;
          if (existingIndex !== -1) {
            // Update existing tool's timestamp and move to front
            newRecentTools = [
              { href: toolHref, visitedAt: now },
              ...state.recentTools.filter((tool) => tool.href !== toolHref),
            ];
          } else {
            // Add new tool to front
            newRecentTools = [
              { href: toolHref, visitedAt: now },
              ...state.recentTools,
            ];
          }

          // Keep only the most recent tools
          return {
            recentTools: newRecentTools.slice(0, state.maxRecentTools),
          };
        }),
      getRecentTools: (allTools) => {
        const { recentTools } = get();
        const recentHrefs = recentTools.map((tool) => tool.href);
        return allTools.filter((tool) => recentHrefs.includes(tool.href));
      },
      clearRecentTools: () => set({ recentTools: [] }),
    }),
    {
      name: "recent-tools-storage",
    }
  )
);
