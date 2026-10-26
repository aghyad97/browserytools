import SystemPromptBuilder from "@/components/SystemPromptBuilder";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/system-prompt-builder");

export default function Page() {
  return (
    <>
      <SystemPromptBuilder />
      <ToolSeoContent slug="system-prompt-builder" />
    </>
  );
}
