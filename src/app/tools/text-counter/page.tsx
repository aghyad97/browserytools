import TextCounter from "@/components/TextCounter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-counter");

export default function TextCounterPage() {
  return (
    <>
      <TextCounter />
      <ToolSeoContent slug="text-counter" />
    </>
  );
}
