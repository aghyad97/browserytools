import { create } from "zustand";

export type EffectType = "fadeIn" | "fadeOut" | "echo" | "reverb";

export interface AudioEffect {
  id: string;
  type: EffectType;
  value: number;
  timestamp: number;
}

export interface AudioSelection {
  start: number;
  end: number;
}

export interface AudioProcessingState {
  audioFile: File | null;
  audioBuffer: AudioBuffer | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  speed: number;
  selection: AudioSelection;
  effects: AudioEffect[];
}

export interface AudioProcessingActions {
  setAudioFile: (file: File | null) => void;
  setAudioBuffer: (buffer: AudioBuffer | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setSpeed: (speed: number) => void;
  setSelection: (selection: AudioSelection) => void;
  addEffect: (effect: Omit<AudioEffect, "id" | "timestamp">) => void;
  removeEffect: (effectId: string) => void;
  reset: () => void;
}

export type AudioStore = AudioProcessingState & AudioProcessingActions;

const initialState: AudioProcessingState = {
  audioFile: null,
  audioBuffer: null,
  isPlaying: false,
  volume: 1,
  duration: 0,
  currentTime: 0,
  speed: 1,
  selection: { start: 0, end: 0 },
  effects: [],
};

export const useAudioStore = create<AudioStore>((set) => ({
  ...initialState,

  setAudioFile: (file) => set({ audioFile: file }),

  setAudioBuffer: (buffer) => set({ audioBuffer: buffer }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setVolume: (volume) => set({ volume }),

  setDuration: (duration) => set({ duration }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setSpeed: (speed) => set({ speed }),

  setSelection: (selection) => set({ selection }),

  addEffect: (effect) =>
    set((state) => ({
      effects: [
        ...state.effects,
        {
          ...effect,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),

  removeEffect: (effectId) =>
    set((state) => ({
      effects: state.effects.filter((effect) => effect.id !== effectId),
    })),

  reset: () => set(initialState),
}));
