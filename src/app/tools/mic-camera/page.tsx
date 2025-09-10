import { generateToolMetadata } from "@/lib/metadata";
import MicCameraTester from "@/components/MicCameraTester";

export const metadata = generateToolMetadata("/tools/mic-camera");

export default function Page() {
  return <MicCameraTester />;
}
