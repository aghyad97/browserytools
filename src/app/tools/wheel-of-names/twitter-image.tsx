import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "wheel-of-names | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("wheel-of-names");
}
