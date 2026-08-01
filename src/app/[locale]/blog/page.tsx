import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogIndex } from "@/components/blog/blog-index";
import { generateLocalizedBlogMetadata } from "@/lib/locale-metadata";
import { defaultLocale, isLocale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) return {};
  return generateLocalizedBlogMetadata(locale);
}

/**
 * The per-language blog hub.
 *
 * Translated posts already live at their own top-level URLs (the `-<locale>`
 * slug suffix), but `/blog` filters by cookie — so to a crawler, which sends
 * no cookie, every translated post was orphaned behind the sitemap. This gives
 * each language a crawlable index that links to its own posts.
 */
export default async function LocaleBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();

  return <BlogIndex locale={locale} />;
}
