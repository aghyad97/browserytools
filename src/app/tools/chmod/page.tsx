import ChmodCalculator from "@/components/ChmodCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/chmod");

export default function Page() {
  return (
    <>
      <ChmodCalculator />
      <ToolSeoContent slug="chmod" />
    </>
  );
}
