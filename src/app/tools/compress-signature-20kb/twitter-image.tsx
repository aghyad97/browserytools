import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "compress-signature-20kb | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("compress-signature-20kb");
}
