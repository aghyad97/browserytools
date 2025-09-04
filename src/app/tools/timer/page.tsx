import Timer from "@/components/Timer";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/timer");

export default function TimerPage() {
  return <Timer />;
}
