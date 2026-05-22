import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Locale, type Dir, defaultLocale, getDir } from "@/lib/locales";

// Re-exported for back-compat with the many components importing these from here.
export type { Locale, Dir };

interface LanguageState {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      dir: getDir(defaultLocale),
      setLocale: (locale) => {
        if (typeof document !== "undefined") {
          document.cookie = `browsery-locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
        }
        set({ locale, dir: getDir(locale) });
      },
    }),
    {
      name: "browsery-locale",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
