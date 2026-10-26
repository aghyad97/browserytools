import ImageConverter from "@/components/ImageConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/image-converter");

export default function Page() {
  return (
    <>
      <ImageConverter />
      <ToolSeoContent slug="image-converter" />
    </>
  );
}
