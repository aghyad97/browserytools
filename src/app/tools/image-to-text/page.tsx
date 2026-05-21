import ImageToText from "@/components/ImageToText";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/image-to-text");

export default function Page() {
  return <ImageToText />;
}
