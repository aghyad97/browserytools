import { generateToolMetadata } from "@/lib/metadata";
import UUIDGenerator from "@/components/UUIDGenerator";

export const metadata = generateToolMetadata("/tools/uuid-generator");

export default function UUIDGeneratorPage() {
  return <UUIDGenerator />;
}
