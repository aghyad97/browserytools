import MetaTagsGenerator from "@/components/MetaTagsGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/meta-tags");

export default function Page() {
  return (
    <>
      <MetaTagsGenerator />
      <ToolSeoContent slug="meta-tags" />
    </>
  );
}
