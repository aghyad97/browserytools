import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "subtitle-cinema-player | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("subtitle-cinema-player");
}
