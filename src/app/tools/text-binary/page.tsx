import TextBinaryConverter from "@/components/TextBinaryConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-binary");

export default function Page() {
  return (
    <>
      <TextBinaryConverter />
      <ToolSeoContent slug="text-binary" />
    </>
  );
}
