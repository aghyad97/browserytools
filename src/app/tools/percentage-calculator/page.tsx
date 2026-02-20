import PercentageCalculator from "@/components/PercentageCalculator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/percentage-calculator");
export default function Page() { return <PercentageCalculator />; }
