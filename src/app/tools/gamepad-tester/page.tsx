import GamepadTester from "@/components/GamepadTester";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/gamepad-tester");

export default function Page() {
  return <GamepadTester />;
}
