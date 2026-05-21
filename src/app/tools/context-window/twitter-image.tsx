import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "context-window | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("context-window");
}
