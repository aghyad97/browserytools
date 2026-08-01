import Calculator from "@/components/Calculator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/calculator");

export default function CalculatorPage() {
  return <Calculator />;
}
