import { generateToolMetadata } from "@/lib/metadata";
import CronParser from "@/components/CronParser";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/cron-parser");

export default function Page() {
  return (
    <>
      <CronParser />
      <ToolSeoContent slug="cron-parser" />
    </>
  );
}
