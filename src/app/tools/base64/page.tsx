import Base64Converter from "@/components/Base64Converter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/base64");

export default function Page() {
  return (
    <>
      <Base64Converter />
      <ToolSeoContent slug="base64" />
    </>
  );
}
