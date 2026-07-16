import CropImage from "@/components/CropImage";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/crop-image");

export default function Page() {
  return <CropImage />;
}
