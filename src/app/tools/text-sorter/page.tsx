import TextSorter from "@/components/TextSorter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/text-sorter");

export default function Page() {
  return (
    <>
      <TextSorter />
      <ToolSeoContent slug="text-sorter" />
    </>
  );
}
