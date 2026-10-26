import MarkdownEditor from "@/components/MarkdownEditor";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/markdown-editor");
export default function Page() { return (
    <>
      <MarkdownEditor />
      <ToolSeoContent slug="markdown-editor" />
    </>
  ); }
