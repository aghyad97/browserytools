import ImageCaptioner from "@/components/ImageCaptioner";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/image-captioner");

export default function Page() {
  return <ImageCaptioner />;
}
