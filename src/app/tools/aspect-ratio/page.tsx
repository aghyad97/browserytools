import AspectRatioCalculator from "@/components/AspectRatioCalculator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/aspect-ratio");

export default function Page() {
  return (
    <>
      <AspectRatioCalculator />
      <ToolSeoContent slug="aspect-ratio" />
    </>
  );
}
