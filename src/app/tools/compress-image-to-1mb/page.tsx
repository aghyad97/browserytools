import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-image-to-1mb");

export default function Page() {
  return (
    <ImageCompression slug="compress-image-to-1mb" preset={{ mode: "target", targetKb: 1024 }} />
  );
}
