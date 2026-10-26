import PhotoCollage from "@/components/PhotoCollage";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/photo-collage");

export default function Page() {
  return (
    <>
      <PhotoCollage />
      <ToolSeoContent slug="photo-collage" />
    </>
  );
}
