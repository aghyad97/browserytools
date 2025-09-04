import UnitConverter from "@/components/UnitConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/unit-converter");

export default function UnitConverterPage() {
  return <UnitConverter />;
}
