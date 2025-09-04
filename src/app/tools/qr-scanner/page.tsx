import { generateToolMetadata } from "@/lib/metadata";
import QRScanner from "@/components/QRScanner";

export const metadata = generateToolMetadata("/tools/qr-scanner");

export default function QRScannerPage() {
  return <QRScanner />;
}
