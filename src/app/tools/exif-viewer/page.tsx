import ExifViewer from "@/components/ExifViewer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/exif-viewer");

export default function Page() {
  return (
    <>
      <ExifViewer />
      <ToolSeoContent slug="exif-viewer" />
    </>
  );
}
