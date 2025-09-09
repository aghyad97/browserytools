import HomePage from "@/components/HomePage";
import StructuredData from "@/components/StructuredData";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { findFirstTool } from "@/lib/search-utils";

export const metadata: Metadata = {
  title: "Browser Tools - Free Online Tools for Productivity",
  description:
    "Discover 30+ free browser-based tools for productivity. No servers, full privacy. Image tools, file converters, text utilities, and more. All tools work directly in your browser.",
  keywords: [
    "browser tools",
    "online tools",
    "free tools",
    "productivity tools",
    "image tools",
    "file converter",
    "text tools",
    "privacy",
    "no server",
    "web tools",
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
    url: "https://browserytools.com",
    title: "Browser Tools - Free Online Tools for Productivity",
    description:
      "Discover 30+ free browser-based tools for productivity. No servers, full privacy. Image tools, file converters, text utilities, and more.",
    siteName: "Browser Tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Browser Tools - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browser Tools - Free Online Tools for Productivity",
    description:
      "Discover 30+ free browser-based tools for productivity. No servers, full privacy.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://browserytools.com",
  },
  category: "technology",
};

interface HomeProps {
  searchParams: {
    search?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  // Handle search parameter and redirect to first tool found
  if (searchParams.search) {
    const searchTerm = searchParams.search;
    const firstTool = findFirstTool(searchTerm);

    if (firstTool) {
      // Redirect to the most relevant tool
      redirect(firstTool.href);
    }
    // If no tool found, continue to show homepage with search results
  }

  return (
    <>
      <StructuredData type="website" />
      <HomePage initialSearchQuery={searchParams.search} />
    </>
  );
}
