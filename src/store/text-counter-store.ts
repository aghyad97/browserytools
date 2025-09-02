import { create } from "zustand";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  readingTime: number;
  speakingTime: number;
}

interface TextCounterState {
  text: string;
  stats: TextStats;
  setText: (text: string) => void;
  clearText: () => void;
}

const calculateStats = (inputText: string): TextStats => {
  const characters = inputText.length;
  const charactersNoSpaces = inputText.replace(/\s/g, "").length;
  const words =
    inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;
  const lines = inputText === "" ? 0 : inputText.split("\n").length;
  const paragraphs =
    inputText.trim() === "" ? 0 : inputText.trim().split(/\n\s*\n/).length;
  const sentences =
    inputText.trim() === ""
      ? 0
      : inputText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  // Average reading speed: 200-250 words per minute
  const readingTime = Math.ceil(words / 225);

  // Average speaking speed: 150-160 words per minute
  const speakingTime = Math.ceil(words / 155);

  const stats = {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    sentences,
    readingTime,
    speakingTime,
  };

  return stats;
};

const initialStats: TextStats = {
  characters: 0,
  charactersNoSpaces: 0,
  words: 0,
  lines: 0,
  paragraphs: 0,
  sentences: 0,
  readingTime: 0,
  speakingTime: 0,
};

export const useTextCounterStore = create<TextCounterState>((set) => ({
  text: "",
  stats: initialStats,
  setText: (text: string) => set({ text, stats: calculateStats(text) }),
  clearText: () => set({ text: "", stats: initialStats }),
}));
