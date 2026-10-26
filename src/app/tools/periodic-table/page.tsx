import PeriodicTable from "@/components/PeriodicTable";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/periodic-table");

export default function Page() {
  return (
    <>
      <PeriodicTable />
      <ToolSeoContent slug="periodic-table" />
    </>
  );
}
