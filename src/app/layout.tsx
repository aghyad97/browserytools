import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/providers/providers";

const geist = Geist({ subsets: ["latin"] });

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
    languages: {
      "x-default": "https://browserytools.com",
      "en": "https://browserytools.com",
      "ar": "https://browserytools.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_SA", "ar_AE", "ar_EG"],
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
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* IBM Plex Sans Arabic — loaded via standard Google Fonts link to avoid Turbopack font bundling issues */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={geist.className}>
        <Script
          id="lang-dir-init"
          strategy="beforeInteractive"
        >{`(function(){try{var raw=localStorage.getItem('browsery-locale');var lang='en';if(raw){var parsed=JSON.parse(raw);lang=(parsed&&parsed.state&&parsed.state.locale)||'en';}else if(navigator.language&&navigator.language.startsWith('ar')){lang='ar';}document.documentElement.setAttribute('lang',lang);document.documentElement.setAttribute('dir',lang==='ar'?'rtl':'ltr');}catch(e){}})();`}</Script>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
