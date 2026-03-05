import AIInstructionDiff from "@/components/AIInstructionDiff";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/ai-instruction-diff");
export default function Page() { return <AIInstructionDiff />; }
