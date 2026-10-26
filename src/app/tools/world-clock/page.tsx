import WorldClock from "@/components/WorldClock";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/world-clock");

export default function Page() {
  return (
    <>
      <WorldClock />
      <ToolSeoContent slug="world-clock" />
    </>
  );
}
