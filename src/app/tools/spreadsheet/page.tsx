import SpreadsheetViewer from "@/components/SpreadsheetViewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spreadsheet Viewer  - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <SpreadsheetViewer />;
}
