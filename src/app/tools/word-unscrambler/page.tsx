import WordUnscrambler from "@/components/WordUnscrambler";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/word-unscrambler");

export default function WordUnscramblerPage() {
  return <WordUnscrambler />;
}
