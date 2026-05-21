import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "model-comparison | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("model-comparison");
}
