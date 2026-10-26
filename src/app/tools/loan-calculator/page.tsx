import LoanCalculator from "@/components/LoanCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/loan-calculator");

export default function Page() {
  return (
    <>
      <LoanCalculator />
      <ToolSeoContent slug="loan-calculator" />
    </>
  );
}
