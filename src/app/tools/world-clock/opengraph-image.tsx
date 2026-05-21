import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "world-clock | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("world-clock");
}
