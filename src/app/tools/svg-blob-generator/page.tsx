import { generateToolMetadata } from "@/lib/metadata";
import SvgBlobGenerator from "@/components/SvgBlobGenerator";

export const metadata = generateToolMetadata("/tools/svg-blob-generator");

export default function Page() {
  return <SvgBlobGenerator />;
}
