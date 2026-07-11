"use client";

/**
 * App shell chrome — mounts the rail (desktop), the mobile bar (<900px) and the
 * ⌘K command palette, wired to a shared open/close state. This replaces the
 * retired Header + Sidebar. It renders only the fixed/overlay chrome; each
 * route-group layout renders its own content region (offset by the rail via the
 * `.content` classes in app-shell.module.css).
 */

import { usePathname, useRouter } from "next/navigation";
import { Rail } from "./rail";
import { MobileBar } from "./mobile-bar";
import { UtilityCluster } from "./utility-cluster";
import { CommandPalette, useCommandPalette } from "./command-palette";
import { useCategoryFilterStore } from "@/store/category-filter-store";

export function AppShell() {
  const { open, setOpen } = useCommandPalette();
  const openPalette = () => setOpen(true);

  const pathname = usePathname();
  const router = useRouter();
  const { category, setCategory } = useCategoryFilterStore();

  // The chip filter only has meaning on the landing grid — off "/" there's
  // no active category to show, and picking one navigates home first.
  const activeCategory = pathname === "/" ? category : null;
  const onCategory = (id: string | null) => {
    setCategory(id);
    if (pathname !== "/") router.push("/");
  };

  return (
    <>
      <Rail activeCategory={activeCategory} onCategory={onCategory} />
      <UtilityCluster />
      <MobileBar activeCategory={activeCategory} onCategory={onCategory} onSearch={openPalette} />
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
