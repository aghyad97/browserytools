import AnagramSolver from "@/components/AnagramSolver";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/anagram-solver");

export default function AnagramSolverPage() {
  return <AnagramSolver />;
}
