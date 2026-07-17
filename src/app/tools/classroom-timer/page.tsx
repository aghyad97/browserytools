import Timer from "@/components/Timer";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/classroom-timer");

export default function ClassroomTimerPage() {
  return (
    <Timer
      slug="classroom-timer"
      preset={{ mode: "countdown", autoFullscreenHint: true }}
    />
  );
}
