import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/merge-pdf");

export default function Page() {
  return (
    <>
      <PDFTools slug="merge-pdf" preset={{ op: "merge" }} />
      <ToolSeoContent slug="merge-pdf" />
    </>
  );
}
