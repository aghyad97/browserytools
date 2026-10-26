import TokenCounter from "@/components/TokenCounter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/token-counter");

export default function Page() {
  return (
    <>
      <TokenCounter />
      <ToolSeoContent slug="token-counter" />
    </>
  );
}
