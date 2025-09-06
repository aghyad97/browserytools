import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Browser Tools - Free Online Tools for Productivity",
    short_name: "Browser Tools",
    description:
      "Discover 30+ free browser-based tools for productivity. No servers, full privacy. Image tools, file converters, text utilities, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["productivity", "utilities", "tools"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon-dark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Browser Tools Homepage",
      },
    ],
    shortcuts: [
      {
        name: "PDF Tools",
        short_name: "PDF",
        description: "Merge, split, and manipulate PDF files",
        url: "/tools/pdf",
        icons: [{ src: "/icon.svg", sizes: "96x96" }],
      },
      {
        name: "Image Tools",
        short_name: "Images",
        description: "Compress, convert, and edit images",
        url: "/tools/image-compression",
        icons: [{ src: "/icon.svg", sizes: "96x96" }],
      },
      {
        name: "Text Tools",
        short_name: "Text",
        description: "Format, count, and convert text",
        url: "/tools/text-case",
        icons: [{ src: "/icon.svg", sizes: "96x96" }],
      },
    ],
  };
}
