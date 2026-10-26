import { generateToolMetadata } from "@/lib/metadata";
import BarcodeScanner from "@/components/BarcodeScanner";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/barcode-scanner");

export default function BarcodeScannerPage() {
  return (
    <>
      <BarcodeScanner />
      <ToolSeoContent slug="barcode-scanner" />
    </>
  );
}
