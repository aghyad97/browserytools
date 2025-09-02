import { create } from "zustand";

export interface Tool {
  name: string;
  href: string;
  description: string;
  category: string;
}

interface ToolStore {
  currentTool: Tool | null;
  setCurrentTool: (tool: Tool | null) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
  currentTool: null,
  setCurrentTool: (tool) => set({ currentTool: tool }),
}));
