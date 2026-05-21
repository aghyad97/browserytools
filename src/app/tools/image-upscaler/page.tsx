import ImageUpscaler from "@/components/ImageUpscaler";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/image-upscaler");

export default function Page() {
  return <ImageUpscaler />;
}
