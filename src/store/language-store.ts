import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Locale = "en" | "ar";
export type Dir = "ltr" | "rtl";

interface LanguageState {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "en",
      dir: "ltr",
      setLocale: (locale) => {
        if (typeof document !== "undefined") {
          document.cookie = `browsery-locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
        }
        set({ locale, dir: locale === "ar" ? "rtl" : "ltr" });
      },
    }),
    {
      name: "browsery-locale",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
