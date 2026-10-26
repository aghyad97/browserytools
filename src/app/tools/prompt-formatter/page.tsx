import PromptFormatter from "@/components/PromptFormatter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/prompt-formatter");

export default function Page() {
  return (
    <>
      <PromptFormatter />
      <ToolSeoContent slug="prompt-formatter" />
    </>
  );
}
