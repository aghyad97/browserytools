import ColorBlindnessSimulator from "@/components/ColorBlindnessSimulator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/color-blindness");
export default function Page() { return <ColorBlindnessSimulator />; }
