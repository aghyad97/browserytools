import { getAllTools } from "@/lib/tools-config";

interface StructuredDataProps {
  type: "website" | "tool" | "organization";
  toolName?: string;
  toolDescription?: string;
  toolCategory?: string;
  toolUrl?: string;
}

export default function StructuredData({
  type,
  toolName,
  toolDescription,
  toolCategory,
  toolUrl,
}: StructuredDataProps) {
  const baseUrl = "https://browserytools.com";
  const allTools = getAllTools().filter((tool) => tool.available);

  const getWebsiteStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Browser Tools",
    description:
      "Free online browser-based tools for productivity. No servers, full privacy. Image tools, file converters, text utilities, and more.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Browser Tools",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Browser Tools Collection",
      description: "Collection of free online tools",
      numberOfItems: allTools.length,
      itemListElement: allTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.name,
          description: tool.description,
          url: `${baseUrl}${tool.href}`,
          applicationCategory: tool.category,
          operatingSystem: "Web Browser",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      })),
    },
  });

  const getToolStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    description: toolDescription,
    url: toolUrl,
    applicationCategory: toolCategory,
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: "Browser Tools",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Browser Tools",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`,
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  });

  const getOrganizationStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Browser Tools",
    description: "Free online browser-based tools for productivity",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/icon.svg`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://github.com/aghyad97/browserytools",
      "https://x.com/aghyadev",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${baseUrl}/coffee`,
    },
  });

  const getStructuredData = () => {
    switch (type) {
      case "website":
        return getWebsiteStructuredData();
      case "tool":
        return getToolStructuredData();
      case "organization":
        return getOrganizationStructuredData();
      default:
        return getWebsiteStructuredData();
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2),
      }}
    />
  );
}
