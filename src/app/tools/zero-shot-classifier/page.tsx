import ZeroShotClassifier from "@/components/ZeroShotClassifier";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/zero-shot-classifier");

export default function Page() {
  return (
    <>
      <ZeroShotClassifier />
      <ToolSeoContent slug="zero-shot-classifier" />
    </>
  );
}
