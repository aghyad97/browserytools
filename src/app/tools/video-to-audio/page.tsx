import VideoToAudio from "@/components/VideoToAudio";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/video-to-audio");

export default function Page() {
  return (
    <>
      <VideoToAudio />
      <ToolSeoContent slug="video-to-audio" />
    </>
  );
}
