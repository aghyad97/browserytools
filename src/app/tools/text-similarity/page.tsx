import TextSimilarity from "@/components/TextSimilarity";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/text-similarity");
export default function Page() { return <TextSimilarity />; }
