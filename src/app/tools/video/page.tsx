import VideoEditor from "@/components/VideoEditor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/video");

export default function Page() {
  return <VideoEditor />;
}
