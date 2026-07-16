import ImageConverter from "@/components/ImageConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/heic-to-jpg");

export default function Page() {
  return (
    <ImageConverter
      slug="heic-to-jpg"
      preset={{ targetFormat: "image/jpeg", lockFormat: true, heicEmphasis: true }}
    />
  );
}
