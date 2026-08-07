import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Governs the support ask.
 *
 * `dismissed` is the only gate and it is permanent and one-way: once the
 * visitor closes the ask, no ask is ever rendered again on that device.
 *
 * `wins` counts successful tool outputs across all visits. It no longer gates
 * anything — the ask rides on every receipt — but it is kept as the one honest
 * measure of how much value this device has actually gotten, which is what any
 * future change to the cadence would need to key off.
 */

interface SupportStore {
  /** Successful tool outputs, all-time on this device. */
  wins: number;
  /** Permanent, one-way opt-out. */
  dismissed: boolean;
  recordWin: () => void;
  dismiss: () => void;
}

export const useSupportStore = create<SupportStore>()(
  persist(
    (set) => ({
      wins: 0,
      dismissed: false,
      recordWin: () => set((state) => ({ wins: state.wins + 1 })),
      dismiss: () => set({ dismissed: true }),
    }),
    {
      name: "support-storage",
    },
  ),
);
