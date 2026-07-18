import SubtitleStudio from "@/components/SubtitleStudio";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/subtitle-studio");

export default function SubtitleStudioPage() {
  return <SubtitleStudio />;
}
