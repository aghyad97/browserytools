import PhotoCensor from "@/components/PhotoCensor";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/photo-censor");

export default function Page() {
  return (
    <>
      <PhotoCensor />
      <ToolSeoContent slug="photo-censor" />
    </>
  );
}
