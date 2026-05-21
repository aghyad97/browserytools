import SpeechToText from "@/components/SpeechToText";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/speech-to-text");

export default function Page() {
  return <SpeechToText />;
}
