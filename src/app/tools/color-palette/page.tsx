import ColorPaletteGenerator from "@/components/ColorPaletteGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/color-palette");
export default function Page() { return (
    <>
      <ColorPaletteGenerator />
      <ToolSeoContent slug="color-palette" />
    </>
  ); }
