import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "dead-pixel-test | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("dead-pixel-test");
}
