import { notFound } from "next/navigation";

import { defaultLocale, isLocale } from "@/lib/locales";

/**
 * The locale-prefixed branch of the route tree (`/es/tools/x`, `/ar`, …).
 *
 * Deliberately has no `generateStaticParams`: every route in this app is
 * already server-rendered on demand (the root layout reads request headers to
 * resolve the locale), so prerendering nothing here keeps the static page
 * count flat while the HTML crawlers receive is identical to a prerendered
 * page. English is not routed through here at all — the middleware 308s
 * `/en/*` back to the unprefixed URLs.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();
  return <>{children}</>;
}
