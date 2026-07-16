import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/merge-pdf");

export default function Page() {
  return <PDFTools slug="merge-pdf" preset={{ op: "merge" }} />;
}
