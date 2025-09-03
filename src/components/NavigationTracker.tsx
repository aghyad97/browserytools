"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRecentToolsStore } from "@/store/recent-tools-store";
import { findToolByHref } from "@/lib/tools-config";

export default function NavigationTracker() {
  const pathname = usePathname();
  const { addRecentTool } = useRecentToolsStore();

  useEffect(() => {
    // Only track tool pages (paths that start with /tools/)
    if (pathname.startsWith("/tools/")) {
      const tool = findToolByHref(pathname);
      if (tool && tool.available) {
        addRecentTool(pathname);
      }
    }
  }, [pathname, addRecentTool]);

  return null; // This component doesn't render anything
}
