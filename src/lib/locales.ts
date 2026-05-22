/**
 * Central locale registry — the single source of truth for every supported language.
 *
 * To add a new language:
 *   1. Add one entry to LOCALES below.
 *   2. Add the matching `messages/<code>.json` file (full translation of en.json).
 *   3. Register its import in `src/providers/language-provider.tsx` (messages map).
 * Everything else (switcher, html dir/lang, hreflang, openGraph, cookie handling)
 * derives from this registry automatically.
 */

export type Dir = "ltr" | "rtl";

export const LOCALES = [
  {
    code: "en",
    label: "English",
    short: "EN",
    dir: "ltr",
    ogLocale: "en_US",
  },
  {
    code: "ar",
    label: "العربية",
    short: "عر",
    dir: "rtl",
    ogLocale: "ar_SA",
  },
  {
    code: "es",
    label: "Español",
    short: "ES",
    dir: "ltr",
    ogLocale: "es_ES",
  },
  {
    code: "pt-BR",
    label: "Português",
    short: "PT",
    dir: "ltr",
    ogLocale: "pt_BR",
  },
  {
    code: "fr",
    label: "Français",
    short: "FR",
    dir: "ltr",
    ogLocale: "fr_FR",
  },
  {
    code: "de",
    label: "Deutsch",
    short: "DE",
    dir: "ltr",
    ogLocale: "de_DE",
  },
  {
    code: "ru",
    label: "Русский",
    short: "RU",
    dir: "ltr",
    ogLocale: "ru_RU",
  },
  {
    code: "id",
    label: "Bahasa Indonesia",
    short: "ID",
    dir: "ltr",
    ogLocale: "id_ID",
  },
] as const;

export type LocaleConfig = (typeof LOCALES)[number];
export type Locale = LocaleConfig["code"];

export const defaultLocale: Locale = "en";
export const localeCodes = LOCALES.map((l) => l.code) as Locale[];

const byCode = new Map<string, LocaleConfig>(LOCALES.map((l) => [l.code, l]));

export function getLocaleConfig(code: Locale): LocaleConfig {
  return byCode.get(code) ?? byCode.get(defaultLocale)!;
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && byCode.has(value);
}

export function getDir(code: Locale): Dir {
  return getLocaleConfig(code).dir;
}

/**
 * Match a raw browser language string (e.g. "pt-BR", "es-419", "ar-EG", "en-GB")
 * to a supported locale. Tries an exact match first, then a primary-subtag match.
 */
export function matchLocale(browserLang: string | undefined | null): Locale | null {
  if (!browserLang) return null;
  const lower = browserLang.toLowerCase();
  const exact = localeCodes.find((c) => c.toLowerCase() === lower);
  if (exact) return exact;
  const prefix = lower.split("-")[0];
  const byPrefix = localeCodes.find((c) => c.toLowerCase().split("-")[0] === prefix);
  return byPrefix ?? null;
}

/** Build the hreflang `alternates.languages` map for a given URL (Option A: same URL per locale). */
export function hreflangLanguages(url: string): Record<string, string> {
  return {
    "x-default": url,
    ...Object.fromEntries(localeCodes.map((c) => [c, url])),
  };
}

/** OpenGraph alternateLocale list — all locales except the primary one. */
export function ogAlternateLocales(current: Locale = defaultLocale): string[] {
  return LOCALES.filter((l) => l.code !== current).map((l) => l.ogLocale);
}
