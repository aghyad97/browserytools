import JsonToTs from "@/components/JsonToTs";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/json-to-ts");

export default function Page() {
  return (
    <>
      <JsonToTs />
      <ToolSeoContent slug="json-to-ts" />
    </>
  );
}
