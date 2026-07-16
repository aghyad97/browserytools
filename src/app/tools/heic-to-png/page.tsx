import ImageConverter from "@/components/ImageConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/heic-to-png");

export default function Page() {
  return (
    <ImageConverter
      slug="heic-to-png"
      preset={{ targetFormat: "image/png", lockFormat: true, heicEmphasis: true }}
    />
  );
}
