"use client";

import { NextIntlClientProvider, type Messages } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import { getDir, matchLocale, type Locale } from "@/lib/locales";
import { loadMessages } from "@/lib/messages";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "sonner";

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  /**
   * `initialLocale`'s messages, resolved on the server. They arrive as a prop
   * rather than being imported here on purpose: this is a client component, so
   * an import would bundle *every* locale's JSON (~2.4 MB) into the chunk each
   * visitor downloads to use exactly one of them. The server can read the
   * message files without shipping them, and passing the resolved locale's
   * messages down keeps the SSR'd HTML fully translated with no async gap and
   * therefore no hydration mismatch. Other locales are fetched lazily, and
   * only if the visitor actually switches language.
   */
  initialMessages: Messages;
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
  initialMessages,
  localePinned = false,
}: LanguageProviderProps) {
  const { locale, setLocale } = useLanguageStore();
  const initialized = useRef(false);

  // Locale and messages move as one unit. Keeping them in a single state means
  // the tree is never rendered with a locale whose messages have not arrived,
  // so switching language shows the previous language until the new one is
  // ready rather than flashing untranslated keys or English.
  const [active, setActive] = useState<{ locale: Locale; messages: Messages }>({
    locale: initialLocale,
    messages: initialMessages,
  });

  // The locale that *should* be showing: the URL when it pinned one, otherwise
  // whatever Zustand holds (rehydrated from localStorage, or set by the switcher).
  const desiredLocale: Locale = localePinned ? initialLocale : locale;

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

  // Bring `active` in line with `desiredLocale`, fetching that locale's chunk
  // first. Nothing is committed until the messages resolve, and a switch that
  // is superseded mid-flight is dropped.
  useEffect(() => {
    if (desiredLocale === active.locale) return;
    // Going back to the server-rendered locale needs no network at all.
    if (desiredLocale === initialLocale) {
      setActive({ locale: initialLocale, messages: initialMessages });
      return;
    }
    let cancelled = false;
    loadMessages(desiredLocale).then((messages) => {
      if (!cancelled) setActive({ locale: desiredLocale, messages });
    });
    return () => {
      cancelled = true;
    };
  }, [desiredLocale, active.locale, initialLocale, initialMessages]);

  // Keep html dir/lang in sync with the locale actually being rendered.
  useEffect(() => {
    document.documentElement.lang = active.locale;
    document.documentElement.dir = getDir(active.locale);
  }, [active.locale]);

  return (
    <NextIntlClientProvider locale={active.locale} messages={active.messages} timeZone="UTC">
      {children}
      <Toaster richColors position={getDir(active.locale) === "rtl" ? "top-left" : "top-right"} />
    </NextIntlClientProvider>
  );
}
