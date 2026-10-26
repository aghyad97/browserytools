import ImageResizer from "@/components/ImageResizer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/image-resizer");

export default function Page() {
  return (
    <>
      <ImageResizer />
      <ToolSeoContent slug="image-resizer" />
    </>
  );
}
