import PdfToWord from "@/components/PdfToWord";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/pdf-to-word");

export default function Page() {
  return <PdfToWord />;
}
