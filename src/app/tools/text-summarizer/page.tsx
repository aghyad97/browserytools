import TextSummarizer from "@/components/TextSummarizer";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/text-summarizer");

export default function Page() {
  return <TextSummarizer />;
}
