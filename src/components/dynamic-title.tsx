"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/store/language-store";

/**
 * Replaces the English brand name in the browser tab title with the
 * locale-appropriate name. Uses a MutationObserver on <title> so it catches
 * both the initial render and every subsequent Next.js client-side navigation.
 */
export function DynamicTitle() {
  const { locale } = useLanguageStore();

  useEffect(() => {
    const applyLocale = () => {
      if (locale === "ar") {
        document.title = document.title.replace(/BrowseryTools/g, "أدواتك");
      } else {
        document.title = document.title.replace(/أدواتك/g, "BrowseryTools");
      }
    };

    // Apply immediately on locale change
    applyLocale();

    // Watch <title> for future changes made by Next.js on navigation
    const titleEl = document.querySelector("title");
    if (!titleEl) return;

    const observer = new MutationObserver(applyLocale);
    observer.observe(titleEl, { childList: true });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}
