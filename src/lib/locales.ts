/**
 * Central locale registry — the single source of truth for every supported language.
 *
 * To add a new language:
 *   1. Add one entry to LOCALES below.
 *   2. Add the matching `messages/<code>.json` file (full translation of en.json).
 * That is the whole checklist — message files are loaded by path from the code
 * below (`src/lib/messages.ts`), and everything else (switcher, html dir/lang,
 * hreflang, openGraph, cookie handling) derives from this registry too.
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
  {
    code: "zh-CN",
    label: "简体中文",
    short: "zh",
    dir: "ltr",
    ogLocale: "zh_CN",
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

export const SITE_URL = "https://browserytools.com";

/**
 * Request headers the middleware sets so server components (which cannot see
 * the URL directly) know which locale to render. `LOCALE_SOURCE_HEADER` is
 * "path" when the locale came from a `/{locale}/…` prefix and "cookie"
 * otherwise — a path locale is pinned and must not be overridden by client
 * state after hydration.
 */
export const LOCALE_HEADER = "x-browsery-locale";
export const LOCALE_SOURCE_HEADER = "x-browsery-locale-source";
export const LOCALE_COOKIE = "browsery-locale";

/**
 * Prefix an app-relative path with a locale segment.
 *
 * English is the unprefixed default — `/tools/x` stays `/tools/x` — because
 * those URLs are already indexed and must never move. Every other locale gets
 * `/{code}` in front: `localePath("/tools/x", "es") === "/es/tools/x"`.
 */
export function localePath(path: string, locale: Locale): string {
  const clean = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/**
 * Split a pathname into its locale prefix (if any) and the remaining path.
 * `/es/tools/x` -> { locale: "es", path: "/tools/x" }
 * `/tools/x`    -> { locale: "en", path: "/tools/x" }
 */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/");
  const first = segments[1];
  if (isLocale(first)) {
    const rest = `/${segments.slice(2).join("/")}`;
    return { locale: first, path: rest === "/" ? "/" : rest.replace(/\/$/, "") || "/" };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}

/**
 * Build the hreflang `alternates.languages` map for an app-relative path.
 *
 * Each entry is a genuinely distinct, resolvable URL: English at the
 * unprefixed path and every other locale at its `/{code}` prefix. `x-default`
 * points at the English URL, which is the one served when no locale is
 * negotiated. Pass the *unprefixed* path (e.g. "/tools/json-formatter") — the
 * same map is correct for every locale variant of that page, since hreflang
 * sets must be identical and reciprocal across the whole cluster.
 */
export function hreflangLanguages(path: string): Record<string, string> {
  const canonicalEn = `${SITE_URL}${localePath(path, defaultLocale)}`;
  return {
    "x-default": canonicalEn,
    ...Object.fromEntries(
      localeCodes.map((c) => [c, `${SITE_URL}${localePath(path, c)}`])
    ),
  };
}

/** OpenGraph alternateLocale list — all locales except the primary one. */
export function ogAlternateLocales(current: Locale = defaultLocale): string[] {
  return LOCALES.filter((l) => l.code !== current).map((l) => l.ogLocale);
}
