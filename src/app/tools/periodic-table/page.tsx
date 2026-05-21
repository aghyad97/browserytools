import PeriodicTable from "@/components/PeriodicTable";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/periodic-table");

export default function Page() {
  return <PeriodicTable />;
}
