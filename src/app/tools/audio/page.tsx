import AudioEditor from "@/components/AudioEditor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/audio");

export default function Page() {
  return <AudioEditor />;
}
