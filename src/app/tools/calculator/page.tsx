import Calculator from "@/components/Calculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/calculator");

export default function CalculatorPage() {
  return (
    <>
      <Calculator />
      <ToolSeoContent slug="calculator" />
    </>
  );
}
