import MindMapClient from "@/components/MindMapClient";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/mind-map");

export default function Page() {
  return (
    <>
      <MindMapClient />
      <ToolSeoContent slug="mind-map" />
    </>
  );
}
