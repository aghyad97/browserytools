import TextToSpeech from "@/components/TextToSpeech";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/text-to-speech");

export default function Page() {
  return <TextToSpeech />;
}
