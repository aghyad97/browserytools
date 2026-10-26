import PercentageCalculator from "@/components/PercentageCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/percentage-calculator");
export default function Page() { return (
    <>
      <PercentageCalculator />
      <ToolSeoContent slug="percentage-calculator" />
    </>
  ); }
