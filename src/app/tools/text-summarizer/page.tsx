import TextSummarizer from "@/components/TextSummarizer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-summarizer");

export default function Page() {
  return (
    <>
      <TextSummarizer />
      <ToolSeoContent slug="text-summarizer" />
    </>
  );
}
