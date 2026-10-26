import ImageConverter from "@/components/ImageConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/heic-to-jpg");

export default function Page() {
  return (
    <>
      <ImageConverter
        slug="heic-to-jpg"
        preset={{ targetFormat: "image/jpeg", lockFormat: true, heicEmphasis: true }}
      />
      <ToolSeoContent slug="heic-to-jpg" />
    </>
  );
}
