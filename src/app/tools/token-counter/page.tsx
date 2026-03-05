import TokenCounter from "@/components/TokenCounter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/token-counter");

export default function Page() {
  return <TokenCounter />;
}
