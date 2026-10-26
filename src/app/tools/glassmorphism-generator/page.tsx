import GlassmorphismGenerator from "@/components/GlassmorphismGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/glassmorphism-generator");
export default function Page() { return (
    <>
      <GlassmorphismGenerator />
      <ToolSeoContent slug="glassmorphism-generator" />
    </>
  ); }
