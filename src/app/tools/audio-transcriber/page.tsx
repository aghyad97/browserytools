import AudioTranscriber from "@/components/AudioTranscriber";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/audio-transcriber");

export default function Page() {
  return <AudioTranscriber />;
}
