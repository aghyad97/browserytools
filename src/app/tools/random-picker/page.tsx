import RandomPicker from "@/components/RandomPicker";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/random-picker");

export default function Page() {
  return <RandomPicker />;
}
