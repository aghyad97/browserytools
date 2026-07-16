import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "sign-pdf | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("sign-pdf");
}
