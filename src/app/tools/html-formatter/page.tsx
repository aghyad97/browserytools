import HtmlFormatter from "@/components/HtmlFormatter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/html-formatter");

export default function Page() {
  return (
    <>
      <HtmlFormatter />
      <ToolSeoContent slug="html-formatter" />
    </>
  );
}
