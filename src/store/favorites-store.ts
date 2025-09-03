import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tool } from "@/lib/tools-config";

interface FavoritesStore {
  favorites: string[]; // Array of tool hrefs
  addFavorite: (toolHref: string) => void;
  removeFavorite: (toolHref: string) => void;
  toggleFavorite: (toolHref: string) => void;
  isFavorite: (toolHref: string) => boolean;
  getFavoriteTools: (
    allTools: (Tool & { category: string })[]
  ) => (Tool & { category: string })[];
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (toolHref) =>
        set((state) => ({
          favorites: [...state.favorites, toolHref],
        })),
      removeFavorite: (toolHref) =>
        set((state) => ({
          favorites: state.favorites.filter((href) => href !== toolHref),
        })),
      toggleFavorite: (toolHref) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.includes(toolHref)) {
          removeFavorite(toolHref);
        } else {
          addFavorite(toolHref);
        }
      },
      isFavorite: (toolHref) => {
        const { favorites } = get();
        return favorites.includes(toolHref);
      },
      getFavoriteTools: (allTools) => {
        const { favorites } = get();
        return allTools.filter((tool) => favorites.includes(tool.href));
      },
    }),
    {
      name: "favorites-storage",
    }
  )
);
