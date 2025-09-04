import { generateToolMetadata } from "@/lib/metadata";
import TimeZoneConverter from "@/components/TimeZoneConverter";

export const metadata = generateToolMetadata("/tools/timezone-converter");

export default function TimeZoneConverterPage() {
  return <TimeZoneConverter />;
}
