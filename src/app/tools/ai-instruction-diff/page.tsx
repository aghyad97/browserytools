import AIInstructionDiff from "@/components/AIInstructionDiff";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/ai-instruction-diff");

export default function Page() {
  return (
    <>
      <AIInstructionDiff />
      <ToolSeoContent slug="ai-instruction-diff" />
    </>
  );
}
