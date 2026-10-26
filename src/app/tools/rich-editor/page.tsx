import RichEditor from "@/components/RichEditor";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/rich-editor");

export default function Page() {
  return (
    <>
      <div className="mx-auto p-4 max-w-6xl">
        <RichEditor />
      </div>
      <ToolSeoContent slug="rich-editor" />
    </>
  );
}
