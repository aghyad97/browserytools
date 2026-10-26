import Notepad from "@/components/Notepad";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/notepad");

export default function Page() {
  return (
    <>
      <Notepad />
      <ToolSeoContent slug="notepad" />
    </>
  );
}
