import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-image-to-100kb");

export default function Page() {
  return (
    <ImageCompression slug="compress-image-to-100kb" preset={{ mode: "target", targetKb: 100 }} />
  );
}
