import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "heic-to-jpg | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("heic-to-jpg");
}
