import KeyboardTester from "@/components/KeyboardTester";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/keyboard-tester");

export default function Page() {
  return <KeyboardTester />;
}
