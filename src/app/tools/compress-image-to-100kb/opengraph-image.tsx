import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "compress-image-to-100kb | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("compress-image-to-100kb");
}
