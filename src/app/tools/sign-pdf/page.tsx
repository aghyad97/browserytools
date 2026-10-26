import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/sign-pdf");

export default function Page() {
  return (
    <>
      <PDFTools slug="sign-pdf" preset={{ op: "sign" }} />
      <ToolSeoContent slug="sign-pdf" />
    </>
  );
}
