import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/jpg-to-pdf");

export default function Page() {
  return <PDFTools slug="jpg-to-pdf" preset={{ op: "images" }} />;
}
