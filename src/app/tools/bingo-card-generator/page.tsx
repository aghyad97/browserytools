import BingoCardGenerator from "@/components/BingoCardGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/bingo-card-generator");

export default function BingoCardGeneratorPage() {
  return (
    <>
      <BingoCardGenerator />
      <ToolSeoContent slug="bingo-card-generator" />
    </>
  );
}
