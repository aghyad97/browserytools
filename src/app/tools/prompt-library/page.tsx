import PromptLibrary from "@/components/PromptLibrary";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/prompt-library");

export default function Page() {
  return (
    <>
      <PromptLibrary />
      <ToolSeoContent slug="prompt-library" />
    </>
  );
}
