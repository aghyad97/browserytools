import SpreadsheetViewer from "@/components/SpreadsheetViewer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/spreadsheet");

export default function Page() {
  return (
    <>
      <SpreadsheetViewer />
      <ToolSeoContent slug="spreadsheet" />
    </>
  );
}
