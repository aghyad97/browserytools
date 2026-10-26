import CompressVideo from "@/components/CompressVideo";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/compress-video");

export default function Page() {
  return (
    <>
      <CompressVideo />
      <ToolSeoContent slug="compress-video" />
    </>
  );
}
