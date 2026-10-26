import ContrastChecker from "@/components/ContrastChecker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/contrast-checker");

export default function Page() {
  return (
    <>
      <ContrastChecker />
      <ToolSeoContent slug="contrast-checker" />
    </>
  );
}
