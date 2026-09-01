import VideoConverter from "@/components/VideoConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/video-converter");

export default function Page() {
  return <VideoConverter />;
}
