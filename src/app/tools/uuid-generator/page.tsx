import { generateToolMetadata } from "@/lib/metadata";
import UUIDGenerator from "@/components/UUIDGenerator";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/uuid-generator");

export default function UUIDGeneratorPage() {
  return (
    <>
      <UUIDGenerator />
      <ToolSeoContent slug="uuid-generator" />
    </>
  );
}
