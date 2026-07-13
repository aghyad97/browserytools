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
      const current = document.title;
      const next =
        locale === "ar"
          ? current.replace(/BrowseryTools/g, "أدواتك")
          : current.replace(/أدواتك/g, "BrowseryTools");
      // Only write when the substitution changes something. Assigning
      // document.title always replaces the <title> text node — even for an
      // identical string — which re-fires this very observer. On pages that
      // set the title after mount (Keep Awake, Pomodoro), the unconditional
      // write turned that into an infinite microtask loop that froze the tab.
      if (next !== current) document.title = next;
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
