import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "image-resizer | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("image-resizer");
}
