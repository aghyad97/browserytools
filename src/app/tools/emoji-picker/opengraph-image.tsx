import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "emoji-picker | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("emoji-picker");
}
