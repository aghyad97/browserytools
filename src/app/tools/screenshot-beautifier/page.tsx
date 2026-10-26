import ScreenshotBeautifier from "@/components/ScreenshotBeautifier";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/screenshot-beautifier");

export default function Page() {
  return (
    <>
      <ScreenshotBeautifier />
      <ToolSeoContent slug="screenshot-beautifier" />
    </>
  );
}
