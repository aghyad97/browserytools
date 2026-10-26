import BarcodeGenerator from "@/components/BarcodeGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/barcode-generator");

export default function BarcodeGeneratorPage() {
  return (
    <>
      <BarcodeGenerator />
      <ToolSeoContent slug="barcode-generator" />
    </>
  );
}
