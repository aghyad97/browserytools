"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import { getDir, matchLocale, type Locale } from "@/lib/locales";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "sonner";
import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";
import esMessages from "../../messages/es.json";
import ptBRMessages from "../../messages/pt-BR.json";
import frMessages from "../../messages/fr.json";
import deMessages from "../../messages/de.json";
import ruMessages from "../../messages/ru.json";
import idMessages from "../../messages/id.json";
import zhCNMessages from "../../messages/zh-CN.json";

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  ar: arMessages,
  es: esMessages,
  "pt-BR": ptBRMessages,
  fr: frMessages,
  de: deMessages,
  ru: ruMessages,
  id: idMessages,
  "zh-CN": zhCNMessages,
};

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  /**
   * True when `initialLocale` came from a `/{locale}/…` URL. A URL locale is
   * an explicit, shareable, indexable declaration — it must beat whatever
   * Zustand rehydrates from localStorage, otherwise `/ar/tools/x` would flip
   * to the visitor's stored language a tick after hydration and the SSR'd
   * Arabic HTML a crawler indexed would not match what a user sees.
   */
  localePinned?: boolean;
}

export function LanguageProvider({
  children,
  initialLocale,
  localePinned = false,
}: LanguageProviderProps) {
  const { locale, dir, setLocale } = useLanguageStore();
  const initialized = useRef(false);

  // Use server-resolved locale for the first render to avoid flash.
  // After mount, follow Zustand (which rehydrates from localStorage) — unless
  // the URL pinned the locale, in which case the URL stays authoritative.
  const [currentLocale, setCurrentLocale] = useState<Locale>(initialLocale);

  // A URL locale is also a preference change: persist it so the cookie, the
  // store and the switcher all agree with the address bar.
  useEffect(() => {
    if (localePinned && locale !== initialLocale) {
      setLocale(initialLocale);
    }
  }, [localePinned, initialLocale, locale, setLocale]);

  // Detect browser language on first visit (no stored preference)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // Never auto-switch away from an explicitly requested URL locale.
      if (localePinned) return;
      const stored = localStorage.getItem("browsery-locale");
      if (!stored) {
        const matched = matchLocale(navigator.language);
        if (matched && matched !== "en") {
          setLocale(matched);
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
  }, [setLocale, localePinned]);

  // Sync currentLocale with Zustand after it rehydrates from localStorage.
  // A pinned (URL) locale is authoritative and never yields to the store.
  useEffect(() => {
    setCurrentLocale(localePinned ? initialLocale : locale);
  }, [locale, localePinned, initialLocale]);

  // Keep html dir/lang in sync with React state
  useEffect(() => {
    document.documentElement.lang = currentLocale;
    document.documentElement.dir = getDir(currentLocale);
  }, [currentLocale]);

  return (
    <NextIntlClientProvider locale={currentLocale} messages={messages[currentLocale]} timeZone="UTC">
      {children}
      <Toaster richColors position={dir === "rtl" ? "top-left" : "top-right"} />
    </NextIntlClientProvider>
  );
}
