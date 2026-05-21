import CompressVideo from "@/components/CompressVideo";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-video");

export default function Page() {
  return <CompressVideo />;
}
