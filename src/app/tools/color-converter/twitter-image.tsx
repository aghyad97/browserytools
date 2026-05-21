import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "color-converter | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("color-converter");
}
