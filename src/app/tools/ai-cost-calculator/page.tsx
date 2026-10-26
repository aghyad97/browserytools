import AICostCalculator from "@/components/AICostCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/ai-cost-calculator");

export default function Page() {
  return (
    <>
      <AICostCalculator />
      <ToolSeoContent slug="ai-cost-calculator" />
    </>
  );
}
