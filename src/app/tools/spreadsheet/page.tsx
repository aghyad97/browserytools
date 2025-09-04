import SpreadsheetViewer from "@/components/SpreadsheetViewer";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/spreadsheet");

export default function Page() {
  return <SpreadsheetViewer />;
}
