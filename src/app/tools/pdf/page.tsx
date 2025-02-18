import PDFTools from "@/components/PDFTools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Tools - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <PDFTools />;
}
