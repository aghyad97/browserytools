import BingoCardGenerator from "@/components/BingoCardGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/bingo-card-generator");

export default function BingoCardGeneratorPage() {
  return <BingoCardGenerator />;
}
