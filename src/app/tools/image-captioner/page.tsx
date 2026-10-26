import ImageCaptioner from "@/components/ImageCaptioner";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/image-captioner");

export default function Page() {
  return (
    <>
      <ImageCaptioner />
      <ToolSeoContent slug="image-captioner" />
    </>
  );
}
