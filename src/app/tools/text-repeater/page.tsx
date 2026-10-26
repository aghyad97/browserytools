import TextRepeater from "@/components/TextRepeater";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-repeater");

export default function Page() {
  return (
    <>
      <TextRepeater />
      <ToolSeoContent slug="text-repeater" />
    </>
  );
}
