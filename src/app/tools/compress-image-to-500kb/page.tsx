import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-image-to-500kb");

export default function Page() {
  return (
    <ImageCompression slug="compress-image-to-500kb" preset={{ mode: "target", targetKb: 500 }} />
  );
}
