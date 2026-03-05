"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore, type Locale } from "@/store/language-store";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "sonner";
import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";

const messages = { en: enMessages, ar: arMessages } as const;

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const { locale, dir, setLocale } = useLanguageStore();
  const initialized = useRef(false);

  // Use server-resolved locale for the first render to avoid flash.
  // After mount, follow Zustand (which rehydrates from localStorage).
  const [currentLocale, setCurrentLocale] = useState<Locale>(initialLocale);

  // Detect browser language on first visit (no stored preference)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const stored = localStorage.getItem("browsery-locale");
      if (!stored) {
        const browserLang = navigator.language || "";
        if (browserLang.startsWith("ar")) {
          setLocale("ar");
        }
      } else {
        // Migrate existing localStorage-only users: write cookie so next SSR visit is correct.
        try {
          const parsed = JSON.parse(stored);
          const storedLocale: Locale = parsed?.state?.locale;
          if (storedLocale && storedLocale !== "en") {
            document.cookie = `browsery-locale=${storedLocale}; path=/; max-age=31536000; SameSite=Lax`;
          }
        } catch {}
      }
    }
  }, [setLocale]);

  // Sync currentLocale with Zustand after it rehydrates from localStorage.
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  // Keep html dir/lang in sync with React state
  useEffect(() => {
    document.documentElement.lang = currentLocale;
    document.documentElement.dir = currentLocale === "ar" ? "rtl" : "ltr";
  }, [currentLocale]);

  return (
    <NextIntlClientProvider locale={currentLocale} messages={messages[currentLocale]} timeZone="UTC">
      {children}
      <Toaster richColors position={dir === "rtl" ? "top-left" : "top-right"} />
    </NextIntlClientProvider>
  );
}
