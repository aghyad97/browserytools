import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/extract-text-from-pdf");

export default function Page() {
  return <PDFTools slug="extract-text-from-pdf" preset={{ op: "extract" }} />;
}
