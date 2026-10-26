import ImageColorPicker from "@/components/ImageColorPicker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/image-color-picker");

export default function Page() {
  return (
    <>
      <ImageColorPicker />
      <ToolSeoContent slug="image-color-picker" />
    </>
  );
}
