import { generateToolMetadata } from "@/lib/metadata";
import BarcodeScanner from "@/components/BarcodeScanner";

export const metadata = generateToolMetadata("/tools/barcode-scanner");

export default function BarcodeScannerPage() {
  return <BarcodeScanner />;
}
