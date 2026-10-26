import GifMaker from "@/components/GifMaker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/gif-maker");

export default function Page() {
  return (
    <>
      <GifMaker />
      <ToolSeoContent slug="gif-maker" />
    </>
  );
}
