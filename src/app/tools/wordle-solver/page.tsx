import WordleSolver from "@/components/WordleSolver";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/wordle-solver");

export default function WordleSolverPage() {
  return (
    <>
      <WordleSolver />
      <ToolSeoContent slug="wordle-solver" />
    </>
  );
}
