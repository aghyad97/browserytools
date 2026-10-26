import TextCaseConverter from "@/components/TextCaseConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-case");

export default function TextCasePage() {
  return (
    <>
      <TextCaseConverter />
      <ToolSeoContent slug="text-case" />
    </>
  );
}
