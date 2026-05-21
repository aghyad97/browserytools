import SentimentAnalyzer from "@/components/SentimentAnalyzer";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/sentiment-analyzer");

export default function Page() {
  return <SentimentAnalyzer />;
}
