import { generateToolMetadata } from "@/lib/metadata";
import TextDiffViewer from "@/components/TextDiffViewer";

export const metadata = generateToolMetadata("/tools/text-diff");

export default function Page() {
  return <TextDiffViewer />;
}
