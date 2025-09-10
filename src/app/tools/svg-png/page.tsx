import { generateToolMetadata } from "@/lib/metadata";
import SvgPngConverter from "@/components/SvgPngConverter";

export const metadata = generateToolMetadata("/tools/svg-png");

export default function Page() {
  return <SvgPngConverter />;
}
