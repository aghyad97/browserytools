import TextToSpeech from "@/components/TextToSpeech";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-to-speech");

export default function Page() {
  return (
    <>
      <TextToSpeech />
      <ToolSeoContent slug="text-to-speech" />
    </>
  );
}
