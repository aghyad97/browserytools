import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "jpg-to-pdf | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("jpg-to-pdf");
}
