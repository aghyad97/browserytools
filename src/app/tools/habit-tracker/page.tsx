import HabitTracker from "@/components/HabitTracker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/habit-tracker");

export default function Page() {
  return (
    <>
      <HabitTracker />
      <ToolSeoContent slug="habit-tracker" />
    </>
  );
}
