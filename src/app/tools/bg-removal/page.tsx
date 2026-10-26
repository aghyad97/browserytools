import BgRemoval from "@/components/BgRemoval";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/bg-removal");

export default function Page() {
  return (
    <>
      <BgRemoval />
      <ToolSeoContent slug="bg-removal" />
    </>
  );
}
