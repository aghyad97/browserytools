import BmiCalculator from "@/components/BmiCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/bmi-calculator");

export default function Page() {
  return (
    <>
      <BmiCalculator />
      <ToolSeoContent slug="bmi-calculator" />
    </>
  );
}
