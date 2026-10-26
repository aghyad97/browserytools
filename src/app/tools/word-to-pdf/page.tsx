import WordToPdf from "@/components/WordToPdf";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/word-to-pdf");

export default function Page() {
  return (
    <>
      <WordToPdf />
      <ToolSeoContent slug="word-to-pdf" />
    </>
  );
}
