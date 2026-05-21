import ZeroShotClassifier from "@/components/ZeroShotClassifier";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/zero-shot-classifier");

export default function Page() {
  return <ZeroShotClassifier />;
}
