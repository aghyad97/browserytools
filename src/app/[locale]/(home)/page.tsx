import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Landing from "@/components/landing/landing";
import StructuredData from "@/components/StructuredData";
import { generateLocalizedHomeMetadata } from "@/lib/locale-metadata";
import { defaultLocale, isLocale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) return {};
  return generateLocalizedHomeMetadata(locale);
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();

  return (
    <>
      <StructuredData type="website" />
      <Landing />
    </>
  );
}
