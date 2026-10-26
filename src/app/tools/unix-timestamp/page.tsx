import { generateToolMetadata } from "@/lib/metadata";
import UnixTimestampConverter from "@/components/UnixTimestampConverter";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/unix-timestamp");

export default function Page() {
  return (
    <>
      <UnixTimestampConverter />
      <ToolSeoContent slug="unix-timestamp" />
    </>
  );
}
