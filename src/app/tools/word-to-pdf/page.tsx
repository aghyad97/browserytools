import WordToPdf from "@/components/WordToPdf";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/word-to-pdf");

export default function Page() {
  return <WordToPdf />;
}
