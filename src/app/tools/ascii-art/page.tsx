import AsciiArt from "@/components/AsciiArt";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/ascii-art");

export default function Page() {
  return (
    <>
      <AsciiArt />
      <ToolSeoContent slug="ascii-art" />
    </>
  );
}
