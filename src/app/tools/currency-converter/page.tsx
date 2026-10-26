import CurrencyConverter from "@/components/CurrencyConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/currency-converter");

export default function CurrencyConverterPage() {
  return (
    <>
      <CurrencyConverter />
      <ToolSeoContent slug="currency-converter" />
    </>
  );
}
