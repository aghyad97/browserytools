import PhotoCensor from "@/components/PhotoCensor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/photo-censor");

export default function Page() {
  return <PhotoCensor />;
}
