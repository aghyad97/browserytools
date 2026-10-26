import { generateToolMetadata } from "@/lib/metadata";
import TextDiffViewer from "@/components/TextDiffViewer";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-diff");

export default function Page() {
  return (
    <>
      <TextDiffViewer />
      <ToolSeoContent slug="text-diff" />
    </>
  );
}
