import SentimentAnalyzer from "@/components/SentimentAnalyzer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/sentiment-analyzer");

export default function Page() {
  return (
    <>
      <SentimentAnalyzer />
      <ToolSeoContent slug="sentiment-analyzer" />
    </>
  );
}
