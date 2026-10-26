import JsonFormatter from "@/components/JsonFormatter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/json-formatter");
export default function Page() { return (
    <>
      <JsonFormatter />
      <ToolSeoContent slug="json-formatter" />
    </>
  ); }
