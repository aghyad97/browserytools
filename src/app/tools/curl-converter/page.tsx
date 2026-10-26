import CurlConverter from "@/components/CurlConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/curl-converter");

export default function Page() {
  return (
    <>
      <CurlConverter />
      <ToolSeoContent slug="curl-converter" />
    </>
  );
}
