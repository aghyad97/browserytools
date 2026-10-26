import { generateToolMetadata } from "@/lib/metadata";
import HashGenerator from "@/components/HashGenerator";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/hash-generator");

export default function HashGeneratorPage() {
  return (
    <>
      <HashGenerator />
      <ToolSeoContent slug="hash-generator" />
    </>
  );
}
