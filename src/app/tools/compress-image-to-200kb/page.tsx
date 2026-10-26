import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/compress-image-to-200kb");

export default function Page() {
  return (
    <>
      <ImageCompression slug="compress-image-to-200kb" preset={{ mode: "target", targetKb: 200 }} />
      <ToolSeoContent slug="compress-image-to-200kb" />
    </>
  );
}
