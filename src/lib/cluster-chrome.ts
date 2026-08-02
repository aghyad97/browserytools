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
// Message files come from `src/lib/messages.ts`, which loads one locale's JSON
// lazily rather than all of them.
// ──────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./locales";
import { loadMessages } from "./messages";
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

export async function getClusterChrome(locale: Locale): Promise<ClusterChrome> {
  const messages = (await loadMessages(locale)) as unknown as { Clusters?: ClusterChrome };
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
