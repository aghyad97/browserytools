import TypingTest from "@/components/TypingTest";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/typing-test");

export default function TypingTestPage() {
  return (
    <>
      <TypingTest />
      <ToolSeoContent slug="typing-test" />
    </>
  );
}
