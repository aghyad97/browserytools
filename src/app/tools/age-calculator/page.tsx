import { generateToolMetadata } from "@/lib/metadata";
import AgeCalculator from "@/components/AgeCalculator";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/age-calculator");

export default function AgeCalculatorPage() {
  return (
    <>
      <AgeCalculator />
      <ToolSeoContent slug="age-calculator" />
    </>
  );
}
