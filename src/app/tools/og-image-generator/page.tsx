import OgImageGenerator from "@/components/OgImageGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/og-image-generator");

export default function Page() {
  return (
    <>
      <OgImageGenerator />
      <ToolSeoContent slug="og-image-generator" />
    </>
  );
}
