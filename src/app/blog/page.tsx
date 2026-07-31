import { cookies } from "next/headers";

import { BlogIndex } from "@/components/blog/blog-index";
import { LOCALE_COOKIE, defaultLocale, hreflangLanguages, isLocale } from "@/lib/locales";

export const metadata = {
  title: "Blog — Privacy, Security & Free Tool Guides | BrowseryTools",
  description: "Learn how to protect your privacy online, use free browser tools without uploading data, and master essential developer and productivity tools.",
  alternates: {
    canonical: "https://browserytools.com/blog",
    languages: hreflangLanguages("/blog"),
  },
};

export default async function BlogPage() {
  const localeCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;

  return <BlogIndex locale={locale} />;
}
