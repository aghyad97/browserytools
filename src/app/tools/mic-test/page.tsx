import MicTester from "@/components/MicTester";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/mic-test");

export default function Page() {
  return (
    <>
      <MicTester />
      <ToolSeoContent slug="mic-test" />
    </>
  );
}
