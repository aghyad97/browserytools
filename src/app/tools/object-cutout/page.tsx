import ObjectCutout from "@/components/ObjectCutout";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/object-cutout");

export default function Page() {
  return (
    <>
      <ObjectCutout />
      <ToolSeoContent slug="object-cutout" />
    </>
  );
}
