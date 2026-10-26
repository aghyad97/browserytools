import CropImage from "@/components/CropImage";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/crop-image");

export default function Page() {
  return (
    <>
      <CropImage />
      <ToolSeoContent slug="crop-image" />
    </>
  );
}
