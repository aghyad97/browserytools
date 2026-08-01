import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateLocalizedToolMetadata } from "@/lib/locale-metadata";
import { defaultLocale, isLocale } from "@/lib/locales";
import { findToolByHref } from "@/lib/tools-config";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === defaultLocale) return {};
  return generateLocalizedToolMetadata(slug, locale);
}

/**
 * The localized view of a tool.
 *
 * Rather than duplicating 176 route files per locale, this renders the exact
 * same page module the English route renders — `src/app/tools/<slug>/page.tsx`
 * — so a tool can never exist in one language tree and not the other. The
 * language comes from the middleware-resolved locale that the root layout
 * feeds into next-intl, so the component's own strings are already translated
 * server-side.
 */
export default async function LocaleToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();

  // Only catalogued tools get a locale URL — otherwise this route would happily
  // serve (and invite indexing of) arbitrary /{locale}/tools/<anything>.
  const tool = findToolByHref(`/tools/${slug}`);
  if (!tool || !tool.available) notFound();

  const mod = await import(`@/app/tools/${slug}/page`).catch(() => null);
  const ToolPage: React.ComponentType | undefined = mod?.default;
  if (!ToolPage) notFound();

  return <ToolPage />;
}
