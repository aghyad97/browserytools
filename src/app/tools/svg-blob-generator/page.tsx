import { generateToolMetadata } from "@/lib/metadata";
import SvgBlobGenerator from "@/components/SvgBlobGenerator";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/svg-blob-generator");

export default function Page() {
  return (
    <>
      <SvgBlobGenerator />
      <ToolSeoContent slug="svg-blob-generator" />
    </>
  );
}
