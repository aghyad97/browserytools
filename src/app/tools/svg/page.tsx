import SvgEditor from "@/components/SvgEditor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/svg");

export default function Page() {
  return <SvgEditor />;
}
