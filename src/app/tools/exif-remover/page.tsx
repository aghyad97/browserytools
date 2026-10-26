import ExifRemover from "@/components/ExifRemover";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/exif-remover");

export default function Page() {
  return (
    <>
      <ExifRemover />
      <ToolSeoContent slug="exif-remover" />
    </>
  );
}
