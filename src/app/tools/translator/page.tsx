import Translator from "@/components/Translator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/translator");

export default function Page() {
  return (
    <>
      <Translator />
      <ToolSeoContent slug="translator" />
    </>
  );
}
