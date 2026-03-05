import ClaudeMdGenerator from "@/components/ClaudeMdGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/claude-md-generator");

export default function Page() {
  return <ClaudeMdGenerator />;
}
