import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — BrowseryTools | Privacy, Security & Free Browser Tool Guides",
  description: "Expert guides on privacy-first browser tools, security best practices, developer tips, and how to use free online tools without uploading your data.",
  openGraph: {
    title: "Blog — BrowseryTools",
    description: "Expert guides on privacy-first browser tools and security best practices.",
    type: "website",
    siteName: "BrowseryTools",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — BrowseryTools",
    description: "Expert guides on privacy-first browser tools and security best practices.",
    images: ["/og-image.png"],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <Link href="/blog" className="font-semibold text-sm">
            BrowseryTools Blog
          </Link>
          <div className="w-24" />
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            All tools at{" "}
            <Link href="/" className="text-primary hover:underline">BrowseryTools.com</Link>{" "}
            run entirely in your browser — no uploads, no accounts, no ads.
          </p>
        </div>
      </footer>
    </div>
  );
}
