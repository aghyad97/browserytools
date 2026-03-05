import ChmodCalculator from "@/components/ChmodCalculator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/chmod");

export default function Page() {
  return <ChmodCalculator />;
}
