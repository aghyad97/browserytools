import { generateToolMetadata } from "@/lib/metadata";
import MicCameraTester from "@/components/MicCameraTester";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/mic-camera");

export default function Page() {
  return (
    <>
      <MicCameraTester />
      <ToolSeoContent slug="mic-camera" />
    </>
  );
}
