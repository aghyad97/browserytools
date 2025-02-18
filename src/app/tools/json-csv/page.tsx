import JsonCsvConverter from "@/components/JsonCsvConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON CSV Converter - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <JsonCsvConverter />;
}
