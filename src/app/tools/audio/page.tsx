import AudioEditor from "@/components/AudioEditor";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/audio");

export default function Page() {
  return (
    <>
      <AudioEditor />
      <ToolSeoContent slug="audio" />
    </>
  );
}
