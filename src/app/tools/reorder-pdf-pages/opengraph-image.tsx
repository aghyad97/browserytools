import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "reorder-pdf-pages | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("reorder-pdf-pages");
}
