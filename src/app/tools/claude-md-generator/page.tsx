import ClaudeMdGenerator from "@/components/ClaudeMdGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/claude-md-generator");

export default function Page() {
  return (
    <>
      <ClaudeMdGenerator />
      <ToolSeoContent slug="claude-md-generator" />
    </>
  );
}
