import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Opt-in interaction-sound preference (R2 chrome).
 *
 * Default is **false** on purpose: a tools site is often used at work, so it
 * must never make noise unrequested. Sounds are turned on by an explicit user
 * gesture (the SoundSwitcher), which also serves as the Web Audio autoplay
 * unlock. Persisted under "browsery-sound" so the choice survives reloads.
 *
 * playCue() in @/lib/ui-sound reads this store OUTSIDE React via getState(), so
 * hot cue paths never subscribe or re-render.
 */
interface SoundState {
  soundOn: boolean;
  toggleSound: () => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      soundOn: false,
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
    }),
    {
      name: "browsery-sound",
    }
  )
);
