import TextEncryption from "@/components/TextEncryption";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-encryption");

export default function Page() {
  return (
    <>
      <TextEncryption />
      <ToolSeoContent slug="text-encryption" />
    </>
  );
}
