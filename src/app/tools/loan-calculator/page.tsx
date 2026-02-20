import LoanCalculator from "@/components/LoanCalculator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/loan-calculator");
export default function Page() { return <LoanCalculator />; }
