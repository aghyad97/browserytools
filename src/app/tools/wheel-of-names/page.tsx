import WheelOfNames from "@/components/WheelOfNames";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/wheel-of-names");

export default function WheelOfNamesPage() {
  return (
    <>
      <WheelOfNames />
      <ToolSeoContent slug="wheel-of-names" />
    </>
  );
}
