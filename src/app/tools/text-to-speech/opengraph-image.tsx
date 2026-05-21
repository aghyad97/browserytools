import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "text-to-speech | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("text-to-speech");
}
