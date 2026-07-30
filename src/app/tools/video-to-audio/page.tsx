import VideoToAudio from "@/components/VideoToAudio";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/video-to-audio");

export default function Page() {
  return <VideoToAudio />;
}
