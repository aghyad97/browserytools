import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-pdf");

export default function Page() {
  return <PDFTools slug="compress-pdf" preset={{ op: "compress" }} />;
}
