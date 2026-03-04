"use client";

import { Button } from "./ui/button";
import { Hammer, Github, Coffee, Menu } from "lucide-react";
import { XLogo } from "@phosphor-icons/react";
import { useToolStore } from "@/store/tool-store";
import { useLanguageStore } from "@/store/language-store";
import Logo from "./logo";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";

export default function Header() {
  const pathname = usePathname();
  const { currentTool, setCurrentTool } = useToolStore();
  const { dir } = useLanguageStore();
  const t = useTranslations("Header");
  const tc = useTranslations("ToolsConfig");
  const tCommon = useTranslations("Common");

  // Reset tool context when not on tools routes
  useEffect(() => {
    if (!pathname.startsWith("/tools")) {
      setCurrentTool(null);
    }
  }, [pathname, setCurrentTool]);

  const handleRequestTool = () => {
    const issueTitle = encodeURIComponent("Tool Request: [Tool Name]");
    const issueBody = encodeURIComponent(
      `
## Tool Request

**Tool Name:**
**Description:**
**Use Case:**
**Priority:** Low/Medium/High

**Additional Details:**
Please describe what this tool should do and how it would help users.
    `.trim(),
    );

    const githubUrl = `https://github.com/aghyad97/browserytools/issues/new?title=${issueTitle}&body=${issueBody}&labels=tool-request`;

    window.open(githubUrl, "_blank");
  };

  return (
    <header className="border-b bg-white/40 dark:bg-black/40 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button and Tool Title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button - only visible on mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("openMenu")}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-80 p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href="/"
            className="flex items-center"
            aria-label="Go to homepage"
          >
            {currentTool ? (
              <div>
                <h1 className="text-sm md:text-md font-semibold">
                  {tc(`tools.${currentTool.href.replace("/tools/", "")}.name` as any)}
                </h1>
              </div>
            ) : (
              <div className="flex flex-row gap-2 rtl:flex-row-reverse">
                <Logo />
                <h1 className="text-sm md:text-xl font-semibold">
                  {tCommon("siteName")}
                </h1>
              </div>
            )}
          </Link>
        </div>

        {/* Social links on the right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop social links */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/gh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("github")}
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("github")}
              >
                <Github className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="/x"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("twitter")}
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("twitter")}
              >
                <XLogo className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          {/* Request tool button - smaller on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestTool}
            className="hidden sm:flex"
          >
            <Hammer className="h-4 w-4 me-2" />
            {t("requestTool")}
          </Button>

          <Link
            href="/x"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden"
            aria-label={t("twitter")}
          >
            <Button
              className="sm:hidden"
              variant="outline"
              size="icon"
              aria-label={t("twitter")}
            >
              <XLogo className="h-4 w-4" />
            </Button>
          </Link>

          {/* Mobile request tool button */}
          <ThemeSwitcher className="sm:hidden" variant="outline" />
          <LanguageSwitcher className="sm:hidden" variant="outline" />

          {/* Coffee button - smaller on mobile */}
          <Link
            href="/coffee"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("coffee")}
          >
            <Button size="sm" className="hidden sm:flex">
              <Coffee className="h-4 w-4 me-2" />
              {t("coffee")}
            </Button>
            <Button
              size="icon"
              className="sm:hidden"
              aria-label={t("coffee")}
            >
              <Coffee className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
