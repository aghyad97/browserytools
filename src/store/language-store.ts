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
      setLocale: (locale) =>
        set({ locale, dir: locale === "ar" ? "rtl" : "ltr" }),
    }),
    {
      name: "browsery-locale",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
