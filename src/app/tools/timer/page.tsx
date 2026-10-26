import Timer from "@/components/Timer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/timer");

export default function TimerPage() {
  return (
    <>
      <Timer />
      <ToolSeoContent slug="timer" />
    </>
  );
}
