import SubtitleCinemaPlayer from "@/components/SubtitleCinemaPlayer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/subtitle-cinema-player");
export default function SubtitleCinemaPlayerPage() { return (
    <>
      <SubtitleCinemaPlayer />
      <ToolSeoContent slug="subtitle-cinema-player" />
    </>
  ); }
