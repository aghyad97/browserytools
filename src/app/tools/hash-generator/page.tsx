import { generateToolMetadata } from "@/lib/metadata";
import HashGenerator from "@/components/HashGenerator";

export const metadata = generateToolMetadata("/tools/hash-generator");

export default function HashGeneratorPage() {
  return <HashGenerator />;
}
