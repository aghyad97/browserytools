import ObjectCutout from "@/components/ObjectCutout";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/object-cutout");

export default function Page() {
  return <ObjectCutout />;
}
