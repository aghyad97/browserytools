import CssGradientGenerator from "@/components/CssGradientGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/css-gradient");

export default function Page() {
  return (
    <>
      <CssGradientGenerator />
      <ToolSeoContent slug="css-gradient" />
    </>
  );
}
