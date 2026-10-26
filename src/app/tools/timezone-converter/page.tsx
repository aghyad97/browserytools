import { generateToolMetadata } from "@/lib/metadata";
import TimeZoneConverter from "@/components/TimeZoneConverter";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/timezone-converter");

export default function TimeZoneConverterPage() {
  return (
    <>
      <TimeZoneConverter />
      <ToolSeoContent slug="timezone-converter" />
    </>
  );
}
