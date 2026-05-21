import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "aspect-ratio | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("aspect-ratio");
}
