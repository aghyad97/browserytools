import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/watermark-pdf");

export default function Page() {
  return <PDFTools slug="watermark-pdf" preset={{ op: "watermark" }} />;
}
