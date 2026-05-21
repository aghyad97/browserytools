import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "exif-remover | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("exif-remover");
}
