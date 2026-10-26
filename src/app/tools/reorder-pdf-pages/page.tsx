import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/reorder-pdf-pages");

export default function Page() {
  return (
    <>
      <PDFTools slug="reorder-pdf-pages" preset={{ op: "reorder" }} />
      <ToolSeoContent slug="reorder-pdf-pages" />
    </>
  );
}
