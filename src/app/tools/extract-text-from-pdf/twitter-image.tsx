import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "extract-text-from-pdf | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("extract-text-from-pdf");
}
