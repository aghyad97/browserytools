import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "glassmorphism-generator | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("glassmorphism-generator");
}
