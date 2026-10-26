import { generateToolMetadata } from "@/lib/metadata";
import ColorConverter from "@/components/ColorConverter";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/color-converter");

export default function Page() {
  return (
    <>
      <ColorConverter />
      <ToolSeoContent slug="color-converter" />
    </>
  );
}
