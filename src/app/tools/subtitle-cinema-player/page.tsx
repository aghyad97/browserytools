import SubtitleCinemaPlayer from "@/components/SubtitleCinemaPlayer";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/subtitle-cinema-player");
export default function SubtitleCinemaPlayerPage() { return <SubtitleCinemaPlayer />; }
