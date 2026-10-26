import ScreenRecorder from "@/components/ScreenRecorder";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/screen-recorder");

export default function Page() {
  return (
    <>
      <ScreenRecorder />
      <ToolSeoContent slug="screen-recorder" />
    </>
  );
}
