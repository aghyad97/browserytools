import WebcamTester from "@/components/WebcamTester";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/webcam-test");

export default function Page() {
  return (
    <>
      <WebcamTester />
      <ToolSeoContent slug="webcam-test" />
    </>
  );
}
