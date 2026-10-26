import MarkdownTableGenerator from "@/components/MarkdownTableGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/markdown-table");

export default function Page() {
  return (
    <>
      <MarkdownTableGenerator />
      <ToolSeoContent slug="markdown-table" />
    </>
  );
}
