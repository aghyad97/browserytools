import HabitTracker from "@/components/HabitTracker";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/habit-tracker");
export default function Page() { return <HabitTracker />; }
