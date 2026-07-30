import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TotpAlgorithm } from "@/lib/totp";

export interface TotpAccount {
  id: string;
  label: string;
  issuer?: string;
  secret: string; // base32, stored as entered — plaintext by explicit user opt-in
  algorithm: TotpAlgorithm;
  digits: 6 | 8;
  period: number;
  persisted: boolean;
}

interface TotpStore {
  accounts: TotpAccount[];
  addAccount: (a: Omit<TotpAccount, "id">) => void;
  removeAccount: (id: string) => void;
  setPersisted: (id: string, persisted: boolean) => void;
  replaceAccount: (id: string, a: Omit<TotpAccount, "id">) => void;
}

export const useTotpStore = create<TotpStore>()(
  persist(
    (set) => ({
      accounts: [],
      addAccount: (a) =>
        set((s) => ({
          accounts: [...s.accounts, { ...a, id: crypto.randomUUID() }],
        })),
      removeAccount: (id) =>
        set((s) => ({ accounts: s.accounts.filter((x) => x.id !== id) })),
      setPersisted: (id, persisted) =>
        set((s) => ({
          accounts: s.accounts.map((x) => (x.id === id ? { ...x, persisted } : x)),
        })),
      replaceAccount: (id, a) =>
        set((s) => ({
          accounts: s.accounts.map((x) => (x.id === id ? { ...a, id } : x)),
        })),
    }),
    {
      name: "totp-storage",
      // Only opted-in accounts ever touch localStorage.
      partialize: (state) => ({
        accounts: state.accounts.filter((a) => a.persisted),
      }),
    }
  )
);
