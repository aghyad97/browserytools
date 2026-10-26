import PdfToWord from "@/components/PdfToWord";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/pdf-to-word");

export default function Page() {
  return (
    <>
      <PdfToWord />
      <ToolSeoContent slug="pdf-to-word" />
    </>
  );
}
