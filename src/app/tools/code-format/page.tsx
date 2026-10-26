import CodeHighlighter from "@/components/CodeHighlighter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/code-format");

export default function Page() {
  return (
    <>
      <CodeHighlighter />
      <ToolSeoContent slug="code-format" />
    </>
  );
}
