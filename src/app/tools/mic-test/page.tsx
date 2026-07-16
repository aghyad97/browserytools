import MicTester from "@/components/MicTester";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/mic-test");

export default function Page() {
  return <MicTester />;
}
