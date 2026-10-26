import WatermarkImage from "@/components/WatermarkImage";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/watermark-image");

export default function Page() {
  return (
    <>
      <WatermarkImage />
      <ToolSeoContent slug="watermark-image" />
    </>
  );
}
