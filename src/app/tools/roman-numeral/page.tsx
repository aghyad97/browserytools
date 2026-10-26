import RomanNumeralConverter from "@/components/RomanNumeralConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/roman-numeral");

export default function Page() {
  return (
    <>
      <RomanNumeralConverter />
      <ToolSeoContent slug="roman-numeral" />
    </>
  );
}
