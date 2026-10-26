import MemeGenerator from "@/components/MemeGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/meme-generator");

export default function Page() {
  return (
    <>
      <MemeGenerator />
      <ToolSeoContent slug="meme-generator" />
    </>
  );
}
