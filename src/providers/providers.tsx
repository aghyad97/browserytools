"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "./language-provider";
import { DynamicTitle } from "@/components/dynamic-title";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <DynamicTitle />
        {children}
      </LanguageProvider>
      <Analytics />
    </NextThemesProvider>
  );
}
