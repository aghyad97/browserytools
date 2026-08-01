import type { Metadata } from "next";

import { getClusterChrome, getRequestLocale } from "./cluster-chrome";
import { getLocaleConfig, hreflangLanguages, ogAlternateLocales } from "./locales";
import { getCluster, type ClusterId } from "./tool-clusters";

const BASE_URL = "https://browserytools.com";

/**
 * Per-hub metadata.
 *
 * Deliberately NOT `generateToolMetadata` from `src/lib/metadata.ts`: that
 * builds a templated "100% Free … | No Ads, No Registration, No Servers" title
 * from a tool's registry entry, which would give all five hubs near-identical
 * titles and descriptions. Each hub gets a hand-written title and description
 * from `messages/<locale>.json` instead, so the five pages do not compete with
 * each other or with the tool pages they link to.
 */
export async function buildClusterMetadata(id: ClusterId): Promise<Metadata> {
  const locale = await getRequestLocale();
  const chrome = await getClusterChrome(locale);
  const cluster = getCluster(id);
  const name = chrome.names[id];
  const url = `${BASE_URL}${cluster.href}`;
  const localeConfig = getLocaleConfig(locale);

  return {
    title: name.metaTitle,
    description: name.metaDescription,
    alternates: {
      canonical: url,
      languages: hreflangLanguages(url),
    },
    openGraph: {
      type: "website",
      url,
      title: name.metaTitle,
      description: name.metaDescription,
      siteName: "BrowseryTools",
      locale: localeConfig.ogLocale,
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: name.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: name.metaTitle,
      description: name.metaDescription,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    category: "technology",
  };
}
