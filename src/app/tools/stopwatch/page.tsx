import Stopwatch from "@/components/Stopwatch";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/stopwatch");

export default function Page() {
  return (
    <>
      <Stopwatch />
      <ToolSeoContent slug="stopwatch" />
    </>
  );
}
