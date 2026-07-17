import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "wordle-solver | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("wordle-solver");
}
