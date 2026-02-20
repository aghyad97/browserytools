import WordFrequencyAnalyzer from "@/components/WordFrequencyAnalyzer";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/word-frequency");
export default function Page() { return <WordFrequencyAnalyzer />; }
