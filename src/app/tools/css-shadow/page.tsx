import CssShadow from "@/components/CssShadow";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/css-shadow");

export default function Page() {
  return (
    <>
      <CssShadow />
      <ToolSeoContent slug="css-shadow" />
    </>
  );
}
