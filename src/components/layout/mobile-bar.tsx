"use client";

/**
 * Mobile top bar (<900px) — the rail's small-screen counterpart.
 *
 * Slim bar with: the "b_" glyph (home link), a ⌘K search button that opens the
 * command palette, and a menu button that opens the full rail content inside
 * the shared Sheet drawer (same pattern header.tsx used for the sidebar).
 *
 * Strings via existing i18n keys only (Rail.search, Header.openMenu); colours
 * via var(--bt-*); logical properties so it mirrors under dir="rtl".
 */

import { useState } from "react";
import Link from "next/link";
import { SearchIcon, MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Rail } from "./rail";
import s from "./mobile-bar.module.css";

export function MobileBar({ onSearch }: { onSearch: () => void }) {
  const t = useTranslations("Rail");
  const tHeader = useTranslations("Header");
  const tCommon = useTranslations("Common");
  const { dir } = useLanguageStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={s.bar} data-testid="mobile-bar">
      <Link href="/" className={s.glyph} aria-label={tCommon("siteName")}>
        b_
      </Link>

      <button className={s.search} onClick={onSearch}>
        <SearchIcon size={14} />
        {t("search")}
        <span className={s.kbd}>⌘K</span>
      </button>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <button className={s.menu} aria-label={tHeader("openMenu")}>
            <MenuIcon size={18} />
          </button>
        </SheetTrigger>
        <SheetContent
          side={dir === "rtl" ? "right" : "left"}
          className={s.sheet}
        >
          <Rail
            variant="sheet"
            onSearch={() => {
              setMenuOpen(false);
              onSearch();
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
