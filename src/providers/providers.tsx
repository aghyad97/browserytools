"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "./language-provider";
import { DynamicTitle } from "@/components/dynamic-title";
import { CoffeeBanner } from "@/components/coffee-banner";
import type { Locale } from "@/store/language-store";

interface ProvidersProps {
  children: ReactNode;
  initialLocale: Locale;
}

export function Providers({ children, initialLocale }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider initialLocale={initialLocale}>
        <DynamicTitle />
        {children}
        <CoffeeBanner />
      </LanguageProvider>
      <Analytics />
    </NextThemesProvider>
  );
}
