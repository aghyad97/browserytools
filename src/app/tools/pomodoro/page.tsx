import PomodoroTimer from "@/components/PomodoroTimer";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/pomodoro");
export default function Page() { return <PomodoroTimer />; }
