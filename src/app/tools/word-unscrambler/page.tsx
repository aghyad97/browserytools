import WordUnscrambler from "@/components/WordUnscrambler";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/word-unscrambler");

export default function WordUnscramblerPage() {
  return (
    <>
      <WordUnscrambler />
      <ToolSeoContent slug="word-unscrambler" />
    </>
  );
}
