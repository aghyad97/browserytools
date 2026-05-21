import ScreenshotBeautifier from "@/components/ScreenshotBeautifier";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/screenshot-beautifier");

export default function Page() {
  return <ScreenshotBeautifier />;
}
