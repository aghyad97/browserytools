import JsonCsvConverter from "@/components/JsonCsvConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/json-csv");

export default function Page() {
  return (
    <>
      <JsonCsvConverter />
      <ToolSeoContent slug="json-csv" />
    </>
  );
}
