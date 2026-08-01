"use client";

import { usePathname } from "next/navigation";

import { localePath, splitLocalePath } from "./locales";

/**
 * Keeps internal links inside the locale section the visitor is already in.
 *
 * The locale is taken from the *URL*, not from client state, on purpose: a
 * visitor on an unprefixed English URL keeps getting unprefixed links (nothing
 * about today's browsing changes), while everything under `/es/…` links to
 * `/es/…`. That internal linking is also how a crawler walks from one locale
 * page to the next instead of relying on the sitemap alone.
 */
export function useLocaleHref(): (href: string) => string {
  const pathname = usePathname();
  const { locale } = splitLocalePath(pathname || "/");

  return (href: string) => {
    if (!href.startsWith("/")) return href;
    return localePath(href, locale);
  };
}
