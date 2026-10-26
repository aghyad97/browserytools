import { generateToolMetadata } from "@/lib/metadata";
import SvgPngConverter from "@/components/SvgPngConverter";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/svg-png");

export default function Page() {
  return (
    <>
      <SvgPngConverter />
      <ToolSeoContent slug="svg-png" />
    </>
  );
}
