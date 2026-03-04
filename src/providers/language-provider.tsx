"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import { useEffect, useRef } from "react";
import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";

const messages = { en: enMessages, ar: arMessages } as const;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir, setLocale } = useLanguageStore();
  const initialized = useRef(false);

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
      }
    }
  }, [setLocale]);

  // Keep html dir/lang in sync with React state
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
