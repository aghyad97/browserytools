import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/jpg-to-pdf");

export default function Page() {
  return (
    <>
      <PDFTools slug="jpg-to-pdf" preset={{ op: "images" }} />
      <ToolSeoContent slug="jpg-to-pdf" />
    </>
  );
}
