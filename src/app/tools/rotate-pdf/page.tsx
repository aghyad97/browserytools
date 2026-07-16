import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/rotate-pdf");

export default function Page() {
  return <PDFTools slug="rotate-pdf" preset={{ op: "rotate" }} />;
}
