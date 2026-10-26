import ModelComparison from "@/components/ModelComparison";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/model-comparison");

export default function Page() {
  return (
    <>
      <ModelComparison />
      <ToolSeoContent slug="model-comparison" />
    </>
  );
}
