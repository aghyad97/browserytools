import VideoEditor from "@/components/VideoEditor";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/video");

export default function Page() {
  return (
    <>
      <VideoEditor />
      <ToolSeoContent slug="video" />
    </>
  );
}
