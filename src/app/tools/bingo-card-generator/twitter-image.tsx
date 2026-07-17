import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "bingo-card-generator | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("bingo-card-generator");
}
