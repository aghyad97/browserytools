import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "@/providers/providers";
import {
  type Locale,
  defaultLocale,
  getDir,
  isLocale,
  hreflangLanguages,
  ogAlternateLocales,
} from "@/lib/locales";

const inter = Inter({ subsets: ["latin"] });

// Self-hosted at build via next/font — same weights previously loaded from Google Fonts.
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrowseryTools — أدواتك | Free Browser-Based Productivity Tools",
    template: "%s | BrowseryTools — أدواتك",
  },
  description:
    "Essential browser-based tools for productivity. No servers. Full privacy. Convert files, compress images, generate passwords, format code, and more — all in your browser. | أدواتك — كل أدوات المتصفح في مكان واحد. بدون خوادم. خصوصية تامة.",
  keywords: [
    "browser tools",
    "productivity tools",
    "file converter",
    "image compression",
    "password generator",
    "code formatter",
    "base64 converter",
    "QR code generator",
    "privacy-focused",
    "client-side tools",
    "no server required",
    "free online tools",
    // Arabic keywords
    "أدواتك",
    "أدوات متصفح",
    "أدوات مجانية",
    "أدوات إنتاجية",
    "خصوصية تامة",
    "بدون خوادم",
    "أدوات الويب",
    "تحويل الملفات",
    "ضغط الصور",
    "مولد كلمات المرور",
    "أدوات مجانية للمطورين",
  ],
  authors: [{ name: "aghyadev" }],
  creator: "aghyadev",
  publisher: "aghyadev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://browserytools.com"),
  alternates: {
    canonical: "/",
    languages: hreflangLanguages("https://browserytools.com"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ogAlternateLocales(),
    url: "https://browserytools.com",
    title: "BrowseryTools — أدواتك | Free Browser-Based Productivity Tools",
    description:
      "Essential browser-based tools for productivity. No servers. Full privacy. | أدواتك — كل أدوات المتصفح في مكان واحد. بدون خوادم. خصوصية تامة.",
    siteName: "BrowseryTools — أدواتك",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrowseryTools - Essential Browser-Based Productivity Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrowseryTools — أدواتك | Free Browser-Based Productivity Tools",
    description:
      "Essential browser-based tools for productivity. No servers. Full privacy. | أدواتك — كل أدوات المتصفح في مكان واحد. بدون خوادم. خصوصية تامة.",
    images: ["/og-image.png"],
    creator: "@aghyadev",
    site: "@aghyadev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Productivity Tools",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BrowseryTools",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    github: "https://github.com/aghyad97",
    x: "https://twitter.com/aghyadev",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFCFB" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0D" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("browsery-locale")?.value;
  const initialLocale: Locale = isLocale(localeCookie) ? localeCookie : defaultLocale;

  return (
    <html
      lang={initialLocale}
      dir={getDir(initialLocale)}
      className={ibmPlexSansArabic.variable}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <Providers initialLocale={initialLocale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
