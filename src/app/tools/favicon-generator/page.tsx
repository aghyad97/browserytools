import FaviconGenerator from "@/components/FaviconGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/favicon-generator");

export default function Page() {
  return (
    <>
      <FaviconGenerator />
      <ToolSeoContent slug="favicon-generator" />
    </>
  );
}
