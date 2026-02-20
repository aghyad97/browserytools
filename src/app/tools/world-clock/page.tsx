import WorldClock from "@/components/WorldClock";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/world-clock");
export default function Page() { return <WorldClock />; }
