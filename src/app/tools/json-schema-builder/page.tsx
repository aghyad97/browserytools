import JsonSchemaBuilder from "@/components/JsonSchemaBuilder";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/json-schema-builder");

export default function Page() {
  return (
    <>
      <JsonSchemaBuilder />
      <ToolSeoContent slug="json-schema-builder" />
    </>
  );
}
