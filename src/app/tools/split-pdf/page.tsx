import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/split-pdf");

export default function Page() {
  return (
    <>
      <PDFTools slug="split-pdf" preset={{ op: "split" }} />
      <ToolSeoContent slug="split-pdf" />
    </>
  );
}
