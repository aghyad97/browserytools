import ClipPathGenerator from "@/components/ClipPathGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/clip-path-generator");

export default function Page() {
  return (
    <>
      <ClipPathGenerator />
      <ToolSeoContent slug="clip-path-generator" />
    </>
  );
}
