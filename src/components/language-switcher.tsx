"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLanguageStore } from "@/store/language-store";
import {
  LOCALES,
  getLocaleConfig,
  localePath,
  splitLocalePath,
  type Locale,
} from "@/lib/locales";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { playCue } from "@/lib/ui-sound";

interface LanguageSwitcherProps {
  variant?: "outline" | "ghost";
  className?: string;
}

export function LanguageSwitcher({
  variant = "ghost",
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguageStore();
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Switching language now changes the URL, not just client state — that is
   * the whole point of the locale routes: the chosen language is shareable,
   * linkable and indexable. The current path (minus any existing locale
   * prefix) and the query string are preserved, so a deep link like
   * `/tools/json-formatter?x=1` becomes `/ar/tools/json-formatter?x=1`.
   *
   * Blog posts are the one exception: translations live at sibling `-<locale>`
   * slugs rather than prefixed URLs, so switching from a post goes to that
   * language's blog index rather than inventing a URL that does not exist.
   */
  const hrefFor = (target: Locale): string => {
    const { path } = splitLocalePath(pathname || "/");
    const basePath = /^\/blog\/.+/.test(path) ? "/blog" : path;
    const query = searchParams?.toString();
    return `${localePath(basePath, target)}${query ? `?${query}` : ""}`;
  };

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
            {getLocaleConfig(locale).short}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => {
              setLocale(code);
              playCue("toggle");
              router.push(hrefFor(code));
            }}
            className={cn(locale === code && "font-semibold")}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
