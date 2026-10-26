import ImageConverter from "@/components/ImageConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/heic-to-png");

export default function Page() {
  return (
    <>
      <ImageConverter
      slug="heic-to-png"
      preset={{ targetFormat: "image/png", lockFormat: true, heicEmphasis: true }}
    />
      <ToolSeoContent slug="heic-to-png" />
    </>
  );
}
