// ──────────────────────────────────────────────────────────────────────────────
// Server-side accessor for the `Clusters` namespace in messages/*.json.
//
// Why this exists: the hub pages under /collections are SERVER components, so
// the prose is present in the raw HTML with JavaScript disabled. next-intl on
// this site is wired up as a CLIENT provider (`src/providers/language-provider`),
// which a server component cannot read from. So the hub pages read the same
// `messages/<locale>.json` files directly, through this module.
//
// The strings still live in the i18n message files and are still translated for
// all nine locales — `src/__tests__/lib/tool-clusters.test.ts` asserts full key
// parity across every locale, which is the same guarantee the MISSING_MESSAGE
// runtime error gives on the client, moved to build time.
//
// Message files are loaded with a dynamic import so only the requested locale's
// JSON ends up being evaluated per request, rather than all nine.
// ──────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./locales";
import type { ClusterId } from "./tool-clusters";

export interface ClusterName {
  /** The page <h1> and the label used in cross-links. */
  title: string;
  /** One-sentence summary under the h1, and the JSON-LD description. */
  tagline: string;
  /** Unique per-hub <title>. Deliberately not the generateToolMetadata template. */
  metaTitle: string;
  metaDescription: string;
}

export interface ClusterChrome {
  collectionLabel: string;
  allToolsLink: string;
  openTool: string;
  relatedHeading: string;
  /** Contains a literal `{count}` placeholder — use `formatToolCount`. */
  toolCount: string;
  englishFallbackNote: string;
  names: Record<ClusterId, ClusterName>;
}

const loaders: Record<Locale, () => Promise<{ default: unknown }>> = {
  en: () => import("../../messages/en.json"),
  ar: () => import("../../messages/ar.json"),
  es: () => import("../../messages/es.json"),
  "pt-BR": () => import("../../messages/pt-BR.json"),
  fr: () => import("../../messages/fr.json"),
  de: () => import("../../messages/de.json"),
  ru: () => import("../../messages/ru.json"),
  id: () => import("../../messages/id.json"),
  "zh-CN": () => import("../../messages/zh-CN.json"),
};

export async function getClusterChrome(locale: Locale): Promise<ClusterChrome> {
  const load = loaders[locale] ?? loaders[defaultLocale];
  const messages = (await load()).default as { Clusters?: ClusterChrome };
  if (!messages.Clusters) {
    throw new Error(
      `messages/${locale}.json is missing the "Clusters" namespace. ` +
        `Every locale must carry it — see src/lib/cluster-chrome.ts.`,
    );
  }
  return messages.Clusters;
}

/**
 * The locale for this request, from the same cookie the root layout reads.
 * Server components cannot see the client-side Zustand store, so the cookie is
 * the only locale signal available before hydration — which is exactly the
 * signal `src/app/layout.tsx` already uses to set `<html lang>`.
 */
export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("browsery-locale")?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Substitute the `{count}` placeholder in the `toolCount` string. */
export function formatToolCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}
