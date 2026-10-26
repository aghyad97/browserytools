import { generateToolMetadata } from "@/lib/metadata";
import QRScanner from "@/components/QRScanner";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/qr-scanner");

export default function QRScannerPage() {
  return (
    <>
      <QRScanner />
      <ToolSeoContent slug="qr-scanner" />
    </>
  );
}
