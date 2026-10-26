import GamepadTester from "@/components/GamepadTester";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/gamepad-tester");

export default function Page() {
  return (
    <>
      <GamepadTester />
      <ToolSeoContent slug="gamepad-tester" />
    </>
  );
}
