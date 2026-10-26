import AIRulesGenerator from "@/components/AIRulesGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/ai-rules-generator");

export default function Page() {
  return (
    <>
      <AIRulesGenerator />
      <ToolSeoContent slug="ai-rules-generator" />
    </>
  );
}
