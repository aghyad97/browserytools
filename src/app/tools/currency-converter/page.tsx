import CurrencyConverter from "@/components/CurrencyConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/currency-converter");

export default function CurrencyConverterPage() {
  return <CurrencyConverter />;
}
