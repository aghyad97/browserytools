import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparisonPage } from "@/components/comparison/comparison-page";
import { JsonLdScript } from "@/components/JsonLdScript";
import { comparisons, getComparison } from "@/lib/comparisons";
import { hreflangLanguages, ogAlternateLocales } from "@/lib/locales";

const BASE_URL = "https://browserytools.com";

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

/**
 * Per-page metadata, hand-written per comparison in src/lib/comparisons.ts.
 * Deliberately NOT routed through generateToolMetadata — these pages need a
 * unique title and description each, not the shared tool template.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};

  const url = `${BASE_URL}/alternatives/${comparison.slug}`;
  const { metaTitle, metaDescription } = comparison;

  return {
    title: metaTitle,
    description: metaDescription,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      alternateLocale: ogAlternateLocales(),
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: "BrowseryTools — أدواتك",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ["/og-image.png"],
      creator: "@aghyadev",
      site: "@aghyadev",
    },
    alternates: {
      canonical: url,
      languages: hreflangLanguages(url),
    },
    category: "technology",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const url = `${BASE_URL}/alternatives/${comparison.slug}`;

  // Structured data goes through <JsonLdScript> so it renders as a real
  // <script type="application/ld+json"> block. Never put JSON-LD in
  // `metadata.other` — Next renders that as an inert <meta> tag.
  //
  // Only the English FAQ feeds FAQPage: JSON-LD is emitted from the server
  // page (no locale context here), so mixing locales would be a lie about
  // what the page says. `ourLimits` and `theirEdge` are deliberately absent —
  // prose for readers, not structured claims.
  const graphs: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: comparison.metaTitle,
      description: comparison.metaDescription,
      url,
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        name: "BrowseryTools",
        url: BASE_URL,
      },
      about: {
        "@type": "Thing",
        name: comparison.competitor,
      },
      publisher: {
        "@type": "Organization",
        name: "BrowseryTools",
        url: BASE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Alternatives",
          item: `${BASE_URL}/alternatives/${comparison.slug}`,
        },
        { "@type": "ListItem", position: 3, name: comparison.en.heading, item: url },
      ],
    },
  ];

  if (comparison.en.faq.length > 0) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: comparison.en.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return (
    <>
      {graphs.map((graph, i) => (
        <JsonLdScript key={i} data={graph} />
      ))}
      <ComparisonPage comparison={comparison} />
    </>
  );
}
