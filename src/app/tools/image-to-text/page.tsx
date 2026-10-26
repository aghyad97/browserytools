import ImageToText from "@/components/ImageToText";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/image-to-text");

export default function Page() {
  return (
    <>
      <ImageToText />
      <ToolSeoContent slug="image-to-text" />
    </>
  );
}
