import { generateToolMetadata } from "@/lib/metadata";
import ColorConverter from "@/components/ColorConverter";

export const metadata = generateToolMetadata("/tools/color-converter");

export default function Page() {
  return <ColorConverter />;
}
