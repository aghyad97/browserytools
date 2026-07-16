import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/compress-signature-20kb");

export default function Page() {
  return (
    <ImageCompression slug="compress-signature-20kb" preset={{ mode: "target", targetKb: 20, format: "image/jpeg", lockFormat: true }} />
  );
}
