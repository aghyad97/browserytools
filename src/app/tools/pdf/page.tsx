import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/pdf");

export default function Page() {
  return <PDFTools />;
}
