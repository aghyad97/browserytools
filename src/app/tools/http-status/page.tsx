import HttpStatusCodes from "@/components/HttpStatusCodes";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/http-status");

export default function Page() {
  return (
    <>
      <HttpStatusCodes />
      <ToolSeoContent slug="http-status" />
    </>
  );
}
