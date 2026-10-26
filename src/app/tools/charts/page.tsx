import { Charts } from "@/components/Charts";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/charts");

export default function ChartsPage() {
  return (
    <>
      <Charts />
      <ToolSeoContent slug="charts" />
    </>
  );
}
