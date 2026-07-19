import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "pdf-to-word | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("pdf-to-word");
}
