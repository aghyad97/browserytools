"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "./language-provider";
import { DynamicTitle } from "@/components/dynamic-title";
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
        {/* Gate every framer-motion spring/transition (rail active pill, tool
            AnimatePresence, etc.) on the user's reduced-motion preference. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LanguageProvider>
      <Analytics />
    </NextThemesProvider>
  );
}
