import PhotoCollage from "@/components/PhotoCollage";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/photo-collage");

export default function Page() {
  return <PhotoCollage />;
}
