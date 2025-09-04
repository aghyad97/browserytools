import BarcodeGenerator from "@/components/BarcodeGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/barcode-generator");

export default function BarcodeGeneratorPage() {
  return <BarcodeGenerator />;
}
