import { create } from "zustand";

/**
 * Session-only category filter — shared between the rail (chrome) and the
 * landing's Popular grid/chip row so a click in either place drives the
 * other. Deliberately NOT persisted: the filter should reset on reload, not
 * stick around like favorites/recents do.
 */
interface CategoryFilterStore {
  category: string | null;
  setCategory: (id: string | null) => void;
}

export const useCategoryFilterStore = create<CategoryFilterStore>()((set) => ({
  category: null,
  setCategory: (id) => set({ category: id }),
}));
