import AsciiArt from "@/components/AsciiArt";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/ascii-art");

export default function Page() {
  return <AsciiArt />;
}
