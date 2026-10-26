import McpConfigGenerator from "@/components/McpConfigGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/mcp-config");
export default function Page() { return (
    <>
      <McpConfigGenerator />
      <ToolSeoContent slug="mcp-config" />
    </>
  ); }
