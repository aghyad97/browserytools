import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "ascii-art | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("ascii-art");
}
