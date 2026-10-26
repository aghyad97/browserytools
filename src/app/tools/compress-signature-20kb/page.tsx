import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/compress-signature-20kb");

export default function Page() {
  return (
    <>
      <ImageCompression slug="compress-signature-20kb" preset={{ mode: "target", targetKb: 20, format: "image/jpeg", lockFormat: true }} />
      <ToolSeoContent slug="compress-signature-20kb" />
    </>
  );
}
