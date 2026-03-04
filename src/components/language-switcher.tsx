"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore, type Locale } from "@/store/language-store";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "outline" | "ghost";
  className?: string;
}

const LOCALES: { locale: Locale; nativeLabel: string }[] = [
  { locale: "en", nativeLabel: "English" },
  { locale: "ar", nativeLabel: "العربية" },
];

export function LanguageSwitcher({
  variant = "ghost",
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguageStore();
  const t = useTranslations("LanguageSwitcher");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn("h-8 px-2 gap-1", className)}
          aria-label={t("label")}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium hidden sm:inline">
            {locale === "ar" ? "عر" : "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(({ locale: l, nativeLabel }) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={cn(locale === l && "font-semibold")}
          >
            {nativeLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
