import UnitConverter from "@/components/UnitConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/unit-converter");

export default function UnitConverterPage() {
  return (
    <>
      <UnitConverter />
      <ToolSeoContent slug="unit-converter" />
    </>
  );
}
