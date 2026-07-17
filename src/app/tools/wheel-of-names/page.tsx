import WheelOfNames from "@/components/WheelOfNames";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/wheel-of-names");

export default function WheelOfNamesPage() {
  return <WheelOfNames />;
}
