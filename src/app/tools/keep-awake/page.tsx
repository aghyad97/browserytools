import KeepAwake from "@/components/KeepAwake";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/keep-awake");

export default function Page() {
  return (
    <>
      <KeepAwake />
      <ToolSeoContent slug="keep-awake" />
    </>
  );
}
