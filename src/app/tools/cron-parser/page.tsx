import { generateToolMetadata } from "@/lib/metadata";
import CronParser from "@/components/CronParser";

export const metadata = generateToolMetadata("/tools/cron-parser");

export default function Page() {
  return <CronParser />;
}
