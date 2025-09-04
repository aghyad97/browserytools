import TypingTest from "@/components/TypingTest";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/typing-test");

export default function TypingTestPage() {
  return <TypingTest />;
}
