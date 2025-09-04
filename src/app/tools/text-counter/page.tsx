import TextCounter from "@/components/TextCounter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/text-counter");

export default function TextCounterPage() {
  return <TextCounter />;
}
