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

  // Short, natural title: tool name + a genuine differentiator (client-side,
  // no signup needed). The site-name suffix is appended by the root layout's
  // title template, so this stays well under typical SERP truncation.
  const seoTitle = `${tool.name} - Free Browser Tool`;

  // Description is the tool's own copy plus one brief, honest clause. Kept
  // short and distinct from common description wording ("browser", "runs
  // entirely...") so it doesn't repeat what the tool's own copy already
  // says. Not every tool runs fully offline (e.g. Currency Converter
  // fetches live exchange rates), so the claim is conditioned on
  // `onDevice` rather than asserted uniformly.
  const runsOnDevice = tool.onDevice !== false;
  const seoDescription = runsOnDevice
    ? `${tool.description} Free, with no signup or uploads.`
    : `${tool.description} Free, with no signup required.`;

  return {
    title: seoTitle,
    description: seoDescription,
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
      // Real, reciprocal hreflang: English at this unprefixed URL and every
      // other locale at its own `/{code}/tools/…` URL. Each alternate is a
      // distinct page that returns 200.
      languages: hreflangLanguages(href),
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

  // Callers already pass a complete, page-specific title/description (see
  // src/app/gh, /coffee, /x, /privacy, /terms) — no boilerplate appended
  // here. The root layout's title template still adds the site-name suffix.
  const seoPageTitle = title;
  const seoPageDescription = description;

  return {
    title: seoPageTitle,
    description: seoPageDescription,
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
    },
    category: "technology",
  };
}
