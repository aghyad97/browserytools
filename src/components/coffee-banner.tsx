"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Coffee, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SESSION_KEY = "coffee-banner-dismissed";
const DELAY_MS = 8_000;

export function CoffeeBanner() {
  const t = useTranslations("CoffeeBanner");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isToolPage = pathname.startsWith("/tools/");

  useEffect(() => {
    if (!isToolPage) return;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [isToolPage, pathname]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:start-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-sm z-50 animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="complementary"
    >
      <div className="rounded-xl border bg-card shadow-lg px-4 py-3 space-y-3">
        <div className="flex items-start gap-3">
          <Coffee className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <p className="text-sm flex-1">{t("message")}</p>
          <button
            onClick={dismiss}
            aria-label={t("dismiss")}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Button asChild size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
          <Link href="/coffee" target="_blank" rel="noopener noreferrer">
            {t("cta")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
