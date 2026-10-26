import WordFrequencyAnalyzer from "@/components/WordFrequencyAnalyzer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/word-frequency");

export default function Page() {
  return (
    <>
      <WordFrequencyAnalyzer />
      <ToolSeoContent slug="word-frequency" />
    </>
  );
}
