import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/image-compression");

export default function Page() {
  return (
    <>
      <ImageCompression />
      <ToolSeoContent slug="image-compression" />
    </>
  );
}
