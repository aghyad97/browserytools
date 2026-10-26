import { generateToolMetadata } from "@/lib/metadata";
import RegexTester from "@/components/RegexTester";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/regex-tester");

export default function Page() {
  return (
    <>
      <RegexTester />
      <ToolSeoContent slug="regex-tester" />
    </>
  );
}
