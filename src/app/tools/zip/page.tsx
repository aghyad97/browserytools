import ZipTool from "@/components/ZipTools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zip Tools  - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <ZipTool />;
}
