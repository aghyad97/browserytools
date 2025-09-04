import TextCaseConverter from "@/components/TextCaseConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/text-case");

export default function TextCasePage() {
  return <TextCaseConverter />;
}
