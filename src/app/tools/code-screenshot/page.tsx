import CodeScreenshot from "@/components/CodeScreenshot";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/code-screenshot");

export default function Page() {
  return (
    <>
      <CodeScreenshot />
      <ToolSeoContent slug="code-screenshot" />
    </>
  );
}
