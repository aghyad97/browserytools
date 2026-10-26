import MermaidViewer from "@/components/MermaidViewer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/mermaid");

export default function Page() {
  return (
    <>
      <MermaidViewer />
      <ToolSeoContent slug="mermaid" />
    </>
  );
}
