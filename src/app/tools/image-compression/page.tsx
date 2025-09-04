import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/image-compression");

export default function Page() {
  return <ImageCompression />;
}
