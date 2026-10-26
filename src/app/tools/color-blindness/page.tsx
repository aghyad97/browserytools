import ColorBlindnessSimulator from "@/components/ColorBlindnessSimulator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/color-blindness");
export default function Page() { return (
    <>
      <ColorBlindnessSimulator />
      <ToolSeoContent slug="color-blindness" />
    </>
  ); }
