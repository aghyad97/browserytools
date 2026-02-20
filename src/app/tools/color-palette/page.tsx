import ColorPaletteGenerator from "@/components/ColorPaletteGenerator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/color-palette");
export default function Page() { return <ColorPaletteGenerator />; }
