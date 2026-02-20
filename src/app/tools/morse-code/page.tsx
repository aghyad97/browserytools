import MorseCodeConverter from "@/components/MorseCodeConverter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/morse-code");
export default function Page() { return <MorseCodeConverter />; }
