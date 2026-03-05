import PromptLibrary from "@/components/PromptLibrary";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/prompt-library");

export default function Page() {
  return <PromptLibrary />;
}
