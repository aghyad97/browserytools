"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/**
 * Keeps the server-rendered SEO block honest across soft navigations.
 *
 * The block reads the URL from the `x-pathname` request header, but Next only
 * re-renders the page segment on an in-app navigation; the layout/template
 * output (and so the block) is reused from the client cache. When the live
 * pathname stops matching the one the block was rendered for, ask the server
 * for a fresh render. Each client pathname triggers at most one refresh, so a
 * mismatch that can never resolve cannot loop.
 */
export function SeoPathnameSync({ serverPathname }: { serverPathname: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const refreshedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (normalize(pathname) === normalize(serverPathname)) return;
    if (refreshedFor.current === pathname) return;
    refreshedFor.current = pathname;
    router.refresh();
  }, [pathname, serverPathname, router]);

  return null;
}
