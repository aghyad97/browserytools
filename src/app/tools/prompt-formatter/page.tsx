import PromptFormatter from "@/components/PromptFormatter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/prompt-formatter");
export default function Page() { return <PromptFormatter />; }
