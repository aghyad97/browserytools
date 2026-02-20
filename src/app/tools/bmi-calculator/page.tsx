import BmiCalculator from "@/components/BmiCalculator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/bmi-calculator");
export default function Page() { return <BmiCalculator />; }
