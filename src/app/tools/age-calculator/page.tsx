import { generateToolMetadata } from "@/lib/metadata";
import AgeCalculator from "@/components/AgeCalculator";

export const metadata = generateToolMetadata("/tools/age-calculator");

export default function AgeCalculatorPage() {
  return <AgeCalculator />;
}
