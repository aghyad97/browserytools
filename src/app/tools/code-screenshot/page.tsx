import CodeScreenshot from "@/components/CodeScreenshot";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/code-screenshot");

export default function Page() {
  return <CodeScreenshot />;
}
