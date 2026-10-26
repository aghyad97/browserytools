import FileConverter from "@/components/FileConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/file-converter");

export default function Page() {
  return (
    <>
      <FileConverter />
      <ToolSeoContent slug="file-converter" />
    </>
  );
}
