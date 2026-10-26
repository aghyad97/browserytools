import LoremIpsumGenerator from "@/components/LoremIpsumGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/lorem-ipsum");

export default function LoremIpsumPage() {
  return (
    <>
      <LoremIpsumGenerator />
      <ToolSeoContent slug="lorem-ipsum" />
    </>
  );
}
