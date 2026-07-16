import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-image-to-20kb");

export default function Page() {
  return (
    <ImageCompression slug="compress-image-to-20kb" preset={{ mode: "target", targetKb: 20 }} />
  );
}
