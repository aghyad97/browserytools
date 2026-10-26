import ImageUpscaler from "@/components/ImageUpscaler";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/image-upscaler");

export default function Page() {
  return (
    <>
      <ImageUpscaler />
      <ToolSeoContent slug="image-upscaler" />
    </>
  );
}
