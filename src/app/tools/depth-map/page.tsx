import DepthMap from "@/components/DepthMap";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/depth-map");

export default function Page() {
  return <DepthMap />;
}
