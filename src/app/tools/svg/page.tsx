import SvgEditor from "@/components/SvgEditor";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/svg");

export default function Page() {
  return (
    <>
      <SvgEditor />
      <ToolSeoContent slug="svg" />
    </>
  );
}
