import SubtitleStudio from "@/components/SubtitleStudio";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/subtitle-studio");

export default function SubtitleStudioPage() {
  return (
    <>
      <SubtitleStudio />
      <ToolSeoContent slug="subtitle-studio" />
    </>
  );
}
