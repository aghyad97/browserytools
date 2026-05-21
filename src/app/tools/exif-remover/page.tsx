import ExifRemover from "@/components/ExifRemover";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/exif-remover");

export default function Page() {
  return <ExifRemover />;
}
