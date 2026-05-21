import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "url-encoder | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("url-encoder");
}
