import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/compress-image-to-50kb");

export default function Page() {
  return (
    <>
      <ImageCompression slug="compress-image-to-50kb" preset={{ mode: "target", targetKb: 50 }} />
      <ToolSeoContent slug="compress-image-to-50kb" />
    </>
  );
}
