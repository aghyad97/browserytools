import WordleSolver from "@/components/WordleSolver";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/wordle-solver");

export default function WordleSolverPage() {
  return <WordleSolver />;
}
