import WatermarkImage from "@/components/WatermarkImage";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/watermark-image");

export default function Page() {
  return <WatermarkImage />;
}
