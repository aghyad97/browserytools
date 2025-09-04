"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
// import { OpenPanelComponent } from "@openpanel/nextjs";
import { Analytics } from "@vercel/analytics/next";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* <OpenPanelComponent
        clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || ""}
        trackScreenViews={true}
        // trackAttributes={true}
        // trackOutgoingLinks={true}
        // If you have a user id, you can pass it here to identify the user
        // profileId={'123'}
      /> */}
      {children}
      {/* <Analytics /> */}
    </NextThemesProvider>
  );
}
