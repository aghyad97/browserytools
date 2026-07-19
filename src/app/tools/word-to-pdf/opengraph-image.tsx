import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "word-to-pdf | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("word-to-pdf");
}
