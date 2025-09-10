import { generateToolMetadata } from "@/lib/metadata";
import RegexTester from "@/components/RegexTester";

export const metadata = generateToolMetadata("/tools/regex-tester");

export default function Page() {
  return <RegexTester />;
}
