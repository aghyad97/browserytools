import ColorCorrection from "@/components/ColorCorrection";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/color-correction");

export default function Page() {
  return (
    <>
      <ColorCorrection />
      <ToolSeoContent slug="color-correction" />
    </>
  );
}
