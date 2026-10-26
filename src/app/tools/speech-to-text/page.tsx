import SpeechToText from "@/components/SpeechToText";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/speech-to-text");

export default function Page() {
  return (
    <>
      <SpeechToText />
      <ToolSeoContent slug="speech-to-text" />
    </>
  );
}
