import { Charts } from "@/components/Charts";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/charts");

export default function ChartsPage() {
  return <Charts />;
}
