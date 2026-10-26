import PiiRedactor from "@/components/PiiRedactor";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/pii-redactor");

export default function Page() {
  return (
    <>
      <PiiRedactor />
      <ToolSeoContent slug="pii-redactor" />
    </>
  );
}
