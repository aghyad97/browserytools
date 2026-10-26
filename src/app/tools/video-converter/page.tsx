import VideoConverter from "@/components/VideoConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/video-converter");

export default function Page() {
  return (
    <>
      <VideoConverter />
      <ToolSeoContent slug="video-converter" />
    </>
  );
}
