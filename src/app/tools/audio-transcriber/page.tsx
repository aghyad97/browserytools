import AudioTranscriber from "@/components/AudioTranscriber";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/audio-transcriber");

export default function Page() {
  return (
    <>
      <AudioTranscriber />
      <ToolSeoContent slug="audio-transcriber" />
    </>
  );
}
