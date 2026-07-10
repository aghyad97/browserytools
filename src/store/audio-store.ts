import { create } from "zustand";

export interface AudioProcessingState {
  audioFile: File | null;
  audioBuffer: AudioBuffer | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  speed: number;
}

export interface AudioProcessingActions {
  setAudioFile: (file: File | null) => void;
  setAudioBuffer: (buffer: AudioBuffer | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setSpeed: (speed: number) => void;
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

  reset: () => set(initialState),
}));
