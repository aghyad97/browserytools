import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "claude-md-generator | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("claude-md-generator");
}
