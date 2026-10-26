import KeyboardTester from "@/components/KeyboardTester";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/keyboard-tester");

export default function Page() {
  return (
    <>
      <KeyboardTester />
      <ToolSeoContent slug="keyboard-tester" />
    </>
  );
}
