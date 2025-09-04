import CodeHighlighter from "@/components/CodeHighlighter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/code-format");

export default function Page() {
  return <CodeHighlighter />;
}
