import MarkdownTableGenerator from "@/components/MarkdownTableGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/markdown-table");

export default function Page() {
  return <MarkdownTableGenerator />;
}
