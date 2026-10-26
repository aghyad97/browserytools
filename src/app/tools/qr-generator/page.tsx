import QRCodeGenerator from "@/components/QRCodeGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/qr-generator");

export default function QRGeneratorPage() {
  return (
    <>
      <QRCodeGenerator />
      <ToolSeoContent slug="qr-generator" />
    </>
  );
}
