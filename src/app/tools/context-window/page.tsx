import ContextWindowCalculator from "@/components/ContextWindowCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/context-window");

export default function Page() {
  return (
    <>
      <ContextWindowCalculator />
      <ToolSeoContent slug="context-window" />
    </>
  );
}
