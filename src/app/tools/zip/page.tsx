import ZipTool from "@/components/ZipTools";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/zip");

export default function Page() {
  return (
    <>
      <ZipTool />
      <ToolSeoContent slug="zip" />
    </>
  );
}
