import Timer from "@/components/Timer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/classroom-timer");

export default function ClassroomTimerPage() {
  return (
    <>
      <Timer
      slug="classroom-timer"
      preset={{ mode: "countdown", autoFullscreenHint: true }}
    />
      <ToolSeoContent slug="classroom-timer" />
    </>
  );
}
