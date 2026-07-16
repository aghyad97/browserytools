import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-jpeg-to-200kb");

export default function Page() {
  return (
    <ImageCompression slug="compress-jpeg-to-200kb" preset={{ mode: "target", targetKb: 200, format: "image/jpeg", lockFormat: true }} />
  );
}
