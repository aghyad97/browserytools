"use client";

import { ThemeSwitcher } from "./theme-switcher";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Tools.Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t py-2 px-4 bg-white/40 backdrop-blur-lg dark:bg-black/40">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("copyright", { year })}
        </p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
