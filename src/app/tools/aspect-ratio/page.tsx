import AspectRatioCalculator from "@/components/AspectRatioCalculator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/aspect-ratio");
export default function Page() { return <AspectRatioCalculator />; }
