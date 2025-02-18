import Base64Converter from "@/components/Base64Converter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Converter - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <Base64Converter />;
}
