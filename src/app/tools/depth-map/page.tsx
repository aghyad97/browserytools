import DepthMap from "@/components/DepthMap";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/depth-map");

export default function Page() {
  return (
    <>
      <DepthMap />
      <ToolSeoContent slug="depth-map" />
    </>
  );
}
