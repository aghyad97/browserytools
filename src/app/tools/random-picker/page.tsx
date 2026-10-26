import RandomPicker from "@/components/RandomPicker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/random-picker");

export default function Page() {
  return (
    <>
      <RandomPicker />
      <ToolSeoContent slug="random-picker" />
    </>
  );
}
