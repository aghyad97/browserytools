import TextSimilarity from "@/components/TextSimilarity";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-similarity");

export default function Page() {
  return (
    <>
      <TextSimilarity />
      <ToolSeoContent slug="text-similarity" />
    </>
  );
}
