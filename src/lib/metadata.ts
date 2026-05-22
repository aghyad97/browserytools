import { Metadata } from "next";
import { findToolByHref } from "./tools-config";
import { hreflangLanguages, ogAlternateLocales } from "./locales";

export function generateToolMetadata(href: string): Metadata {
  const tool = findToolByHref(href);

  if (!tool) {
    return {
      title: "Tool Not Found - Browser Tools",
      description: "The requested tool could not be found.",
    };
  }

  const baseUrl = "https://browserytools.com";
  const toolUrl = `${baseUrl}${href}`;

  // Enhanced SEO-optimized title and description
  const seoTitle = `${tool.name} - 100% Free ${tool.category} Tool | No Ads, No Registration, No Servers`;
  const seoDescription = `${tool.description} Completely free forever - no hidden fees, no ads, no registration required. Runs entirely in your browser with full privacy. Open source and updated weekly with new features.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      tool.name.toLowerCase(),
      tool.category.toLowerCase(),
      "free",
      "online",
      "browser tool",
      "no signup",
      "privacy",
      "client side",
    ],
    authors: [{ name: "Browser Tools" }],
    creator: "Browser Tools",
    publisher: "Browser Tools",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ogAlternateLocales(),
      url: toolUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: "BrowseryTools — أدواتك",
      // No `images` here on purpose: the file-based `opengraph-image.tsx`
      // at the tools route segment generates a per-tool branded image.
      // Hardcoding a static image would override that generated route.
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      // Twitter image is also provided by the file-based `twitter-image.tsx`.
      creator: "@browserytools",
      site: "@browserytools",
    },
    alternates: {
      canonical: toolUrl,
      languages: hreflangLanguages(toolUrl),
    },
    category: "technology",
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = ""
): Metadata {
  const baseUrl = "https://browserytools.com";
  const pageUrl = `${baseUrl}${path}`;

  // Enhanced SEO-optimized page metadata
  const seoPageTitle = title.includes("100% Free")
    ? title
    : `${title} | 100% Free Online Tools - No Ads, No Registration`;
  const seoPageDescription = description.includes("free forever")
    ? description
    : `${description} Completely free forever - no hidden fees, no ads, no registration required. Open source browser-based tools with complete privacy.`;

  return {
    title: seoPageTitle,
    description: seoPageDescription,
    keywords: [
      "browser tools",
      "online tools",
      "free tools",
      "no signup",
      "privacy",
      "client side",
      "open source",
      "productivity",
    ],
    authors: [{ name: "Browser Tools" }],
    creator: "Browser Tools",
    publisher: "Browser Tools",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ogAlternateLocales(),
      url: pageUrl,
      title: seoPageTitle,
      description: seoPageDescription,
      siteName: "BrowseryTools — أدواتك",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: seoPageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoPageTitle,
      description: seoPageDescription,
      images: ["/og-image.png"],
      creator: "@browserytools",
      site: "@browserytools",
    },
    alternates: {
      canonical: pageUrl,
      languages: hreflangLanguages(pageUrl),
    },
    category: "technology",
  };
}
