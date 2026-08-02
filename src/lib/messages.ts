// ──────────────────────────────────────────────────────────────────────────────
// The one way to get a locale's messages.
//
// `messages/*.json` is ~2.4 MB across the supported locales and grows with
// every language added, but a visitor renders exactly one of them. So nothing
// here is a static import: the template-literal `import()` makes the bundler
// emit one lazy chunk per message file, and — because the path is derived
// rather than listed — `src/lib/locales.ts` stays the only place a locale is
// ever registered.
//
// Two callers:
//   • `src/app/layout.tsx` (server) awaits the active locale's messages and
//     passes them to `LanguageProvider` as a prop, so the SSR'd HTML is fully
//     translated and hydration matches.
//   • `LanguageProvider` (client) calls this only when the visitor switches to
//     a locale other than the server-rendered one.
// ──────────────────────────────────────────────────────────────────────────────

import type { Messages } from "next-intl";
import { defaultLocale, isLocale, type Locale } from "./locales";

/** Load one locale's messages. Falls back to the default locale if unknown. */
export async function loadMessages(locale: Locale): Promise<Messages> {
  const target = isLocale(locale) ? locale : defaultLocale;
  const mod = await import(`../../messages/${target}.json`);
  return mod.default as Messages;
}
