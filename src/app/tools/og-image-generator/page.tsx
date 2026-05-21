import OgImageGenerator from "@/components/OgImageGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/og-image-generator");

export default function Page() {
  return <OgImageGenerator />;
}
