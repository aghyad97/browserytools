import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/split-pdf");

export default function Page() {
  return <PDFTools slug="split-pdf" preset={{ op: "split" }} />;
}
