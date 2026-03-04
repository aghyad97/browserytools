"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/language-store";

/**
 * Replaces the English brand name in the browser tab title with the
 * locale-appropriate name whenever the route or locale changes.
 * Must be rendered inside the app shell so it runs on every navigation.
 */
export function DynamicTitle() {
  const pathname = usePathname();
  const { locale } = useLanguageStore();

  useEffect(() => {
    // Small delay to let Next.js update document.title first after navigation
    const timer = setTimeout(() => {
      if (locale === "ar") {
        document.title = document.title.replace(/BrowseryTools/g, "أدواتك");
      } else {
        document.title = document.title.replace(/أدواتك/g, "BrowseryTools");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [locale, pathname]);

  return null;
}
