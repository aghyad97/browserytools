import TipCalculator from "@/components/TipCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/tip-calculator");
export default function Page() { return (
    <>
      <TipCalculator />
      <ToolSeoContent slug="tip-calculator" />
    </>
  ); }
