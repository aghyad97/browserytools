import MarkdownEditor from "@/components/MarkdownEditor";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/markdown-editor");
export default function Page() { return <MarkdownEditor />; }
