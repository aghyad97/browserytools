import QRCodeGenerator from "@/components/QRCodeGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/qr-generator");

export default function QRGeneratorPage() {
  return <QRCodeGenerator />;
}
