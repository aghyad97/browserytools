import YamlJsonConverter from "@/components/YamlJsonConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/yaml-json");

export default function Page() {
  return (
    <>
      <YamlJsonConverter />
      <ToolSeoContent slug="yaml-json" />
    </>
  );
}
