import WebcamTester from "@/components/WebcamTester";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/webcam-test");

export default function Page() {
  return <WebcamTester />;
}
