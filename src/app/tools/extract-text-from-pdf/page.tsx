import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/extract-text-from-pdf");

export default function Page() {
  return (
    <>
      <PDFTools slug="extract-text-from-pdf" preset={{ op: "extract" }} />
      <ToolSeoContent slug="extract-text-from-pdf" />
    </>
  );
}
