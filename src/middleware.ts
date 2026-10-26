import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  LOCALE_SOURCE_HEADER,
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/locales";

/**
 * Makes the active locale a *server-known* value.
 *
 * The root layout renders `<html lang>`/`dir` and seeds next-intl, but a layout
 * cannot see the request URL, so it cannot tell that `/es/tools/x` is Spanish.
 * This middleware resolves the locale once per request — URL prefix first,
 * then the persisted cookie, then the default — and forwards it as a request
 * header the root layout reads. No rewrite and no redirect: the `[locale]`
 * route segment handles the actual routing, so existing unprefixed URLs are
 * untouched.
 */
export function middleware(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  const fromPath = isLocale(segment) ? segment : null;

  // English lives at the unprefixed URLs, which are the indexed ones. Fold
  // `/en/tools/x` into `/tools/x` permanently so the two never compete.
  if (fromPath === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value;
  const fromCookie = isLocale(cookieValue) ? cookieValue : null;

  const locale: Locale = fromPath ?? fromCookie ?? defaultLocale;

  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  headers.set(LOCALE_SOURCE_HEADER, fromPath ? "path" : "cookie");

  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Everything except Next internals, the metadata routes and any file with an
  // extension (static assets, /robots.txt, /sitemap.xml, the copied wasm/worker
  // bundles in /public, …).
  matcher: ["/((?!api|_next/static|_next/image|.*\\.).*)"],
};
