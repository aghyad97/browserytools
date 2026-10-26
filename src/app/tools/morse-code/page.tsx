import MorseCodeConverter from "@/components/MorseCodeConverter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/morse-code");
export default function Page() { return (
    <>
      <MorseCodeConverter />
      <ToolSeoContent slug="morse-code" />
    </>
  ); }
