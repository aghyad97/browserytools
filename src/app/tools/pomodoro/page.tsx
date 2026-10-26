import PomodoroTimer from "@/components/PomodoroTimer";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/pomodoro");
export default function Page() { return (
    <>
      <PomodoroTimer />
      <ToolSeoContent slug="pomodoro" />
    </>
  ); }
